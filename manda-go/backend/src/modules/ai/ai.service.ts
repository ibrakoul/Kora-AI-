import {
  Injectable,
  Logger,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Observable, Subject } from 'rxjs';
import OpenAI from 'openai';

import { ChatDto } from './dto/chat.dto';
import { PronunciationCheckDto } from './dto/pronunciation-check.dto';

// AI Usage limits per subscription tier
const AI_LIMITS = {
  free: { chatMessages: 10, pronunciationChecks: 5, dailyReset: true },
  basic: { chatMessages: 50, pronunciationChecks: 30, dailyReset: true },
  premium: { chatMessages: 200, pronunciationChecks: 100, dailyReset: true },
  platinum: { chatMessages: -1, pronunciationChecks: -1, dailyReset: false }, // unlimited
};

const SYSTEM_PROMPT = `You are Ming (明), an expert Mandarin Chinese language tutor for the Manda Go app. Your personality is:
- Encouraging, patient, and supportive
- Expert in teaching Mandarin to English speakers
- Knowledgeable about Chinese culture and customs
- Adaptive to the learner's level (beginner to advanced)

When helping students:
1. Always provide PINYIN alongside Chinese characters (e.g., 你好 nǐ hǎo)
2. Explain tones clearly (use tone marks: ā á ǎ à for tones 1-4, a for neutral)
3. Give cultural context when relevant
4. Correct mistakes gently and explain why
5. Use the SM-2 SRS principle - reinforce vocabulary they've recently learned
6. Keep responses concise and focused for mobile users

Response format for vocabulary:
- 汉字 (hànzì) - Character
- pīnyīn - Pinyin with tones
- Meaning - English translation
- Usage note or mnemonic

Always respond in the user's native language unless asked to respond in Chinese.`;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;
  private conversationContexts = new Map<string, any[]>();

  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('ai-processing') private readonly aiQueue: Queue,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async chat(userId: string, chatDto: ChatDto, subscriptionTier: string) {
    const { message, conversationId, language = 'en', hskContext } = chatDto;

    // Check usage limits
    await this.checkAiUsageLimit(userId, subscriptionTier, 'chat');

    try {
      // Build conversation context
      const context = this.getOrCreateContext(conversationId || userId);

      // Add user message to context
      context.push({ role: 'user', content: message });

      // Build system message with user context
      const systemContent = `${SYSTEM_PROMPT}

Current student context:
- Native language: ${language}
- Current HSK level: ${hskContext?.hskLevel || 'HSK1'}
- Recent vocabulary: ${(hskContext?.recentWords || []).join(', ')}
- Learning objective: ${hskContext?.currentLesson || 'General Mandarin learning'}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemContent },
          ...context.slice(-10), // Keep last 10 messages for context
        ],
        temperature: 0.7,
        max_tokens: 800,
        presence_penalty: 0.3,
        frequency_penalty: 0.5,
      });

      const assistantMessage = response.choices[0]?.message?.content || '';

      // Add assistant response to context
      context.push({ role: 'assistant', content: assistantMessage });

      // Keep context manageable
      if (context.length > 20) {
        context.splice(0, 2);
      }

      // Track usage
      await this.trackAiUsage(userId, 'chat', response.usage?.total_tokens || 0);

      // Queue background save to DB
      await this.aiQueue.add('save-conversation', {
        userId,
        conversationId: conversationId || userId,
        userMessage: message,
        assistantMessage,
        tokensUsed: response.usage?.total_tokens,
      });

      return {
        response: assistantMessage,
        conversationId: conversationId || userId,
        suggestions: this.generateFollowUpSuggestions(message, assistantMessage),
        tokensUsed: response.usage?.total_tokens,
      };
    } catch (error: any) {
      this.logger.error('OpenAI chat error', error);

      if (error?.status === 429) {
        throw new ForbiddenException('AI service is temporarily unavailable due to high demand. Please try again in a moment.');
      }

      throw new InternalServerErrorException('Failed to get AI response');
    }
  }

  streamChat(userId: string, chatDto: ChatDto, subscriptionTier: string): Observable<MessageEvent> {
    const subject = new Subject<MessageEvent>();

    const streamResponse = async () => {
      try {
        await this.checkAiUsageLimit(userId, subscriptionTier, 'chat');

        const { message, language = 'en' } = chatDto;

        const stream = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
          max_tokens: 800,
          stream: true,
        });

        let fullResponse = '';

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            fullResponse += content;
            subject.next({
              data: JSON.stringify({ type: 'chunk', content }),
            } as MessageEvent);
          }
        }

        subject.next({
          data: JSON.stringify({ type: 'done', fullResponse }),
        } as MessageEvent);

        subject.complete();
      } catch (error) {
        this.logger.error('Stream chat error', error);
        subject.error(error);
      }
    };

    streamResponse();
    return subject.asObservable();
  }

  async getConversations(userId: string, options: { page: number; limit: number }) {
    // In production, retrieve from database
    return {
      conversations: [],
      total: 0,
      page: options.page,
      limit: options.limit,
    };
  }

  async getConversation(conversationId: string, userId: string) {
    // In production, retrieve from database with ownership check
    const context = this.conversationContexts.get(conversationId);
    if (!context) {
      throw new NotFoundException('Conversation not found');
    }

    return {
      conversationId,
      messages: context,
      messageCount: context.length,
    };
  }

  async resetConversation(conversationId: string, userId: string): Promise<void> {
    this.conversationContexts.delete(conversationId);
  }

  async checkPronunciation(
    userId: string,
    audioFile: Express.Multer.File,
    dto: PronunciationCheckDto,
  ) {
    const { targetWord, targetPinyin, tones } = dto;

    try {
      // Step 1: Transcribe the audio using Whisper
      const audioBlob = new Blob([audioFile.buffer], { type: audioFile.mimetype });
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'zh');
      formData.append('response_format', 'verbose_json');

      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile as any,
        model: 'whisper-1',
        language: 'zh',
        response_format: 'verbose_json',
      });

      const transcribedText = transcription.text;

      // Step 2: Use GPT-4 to analyze pronunciation quality
      const analysisPrompt = `You are a Mandarin pronunciation expert. Analyze the pronunciation attempt:

Target word: ${targetWord}
Target pinyin: ${targetPinyin}
Expected tones: ${tones?.join(', ') || 'not specified'}
Transcribed audio: "${transcribedText}"

Provide a JSON response with:
{
  "overallScore": <0-100>,
  "toneAccuracy": <0-100>,
  "clarity": <0-100>,
  "fluency": <0-100>,
  "isCorrect": <boolean>,
  "feedback": "<specific feedback>",
  "corrections": ["<correction 1>", "<correction 2>"],
  "encouragement": "<encouraging message>",
  "toneAnalysis": [{"tone": <number>, "isCorrect": <boolean>, "expected": "<expected>", "detected": "<detected>"}]
}`;

      const analysisResponse = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: analysisPrompt }],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      });

      const analysis = JSON.parse(analysisResponse.choices[0]?.message?.content || '{}');

      // Queue background save
      await this.aiQueue.add('save-pronunciation-attempt', {
        userId,
        targetWord,
        targetPinyin,
        transcribedText,
        analysis,
        timestamp: new Date(),
      });

      return {
        targetWord,
        targetPinyin,
        transcribedText,
        ...analysis,
      };
    } catch (error: any) {
      this.logger.error('Pronunciation check error', error);
      throw new InternalServerErrorException('Pronunciation analysis failed');
    }
  }

  async translate(
    text: string,
    from: string,
    to: string,
    includeBreakdown: boolean = false,
  ) {
    if (!text || text.length > 1000) {
      throw new BadRequestException('Text must be between 1 and 1000 characters');
    }

    try {
      const prompt = includeBreakdown
        ? `Translate this from ${from} to ${to} and provide a word-by-word breakdown:
"${text}"

Respond in JSON format:
{
  "translation": "<translation>",
  "pinyin": "<pinyin if Chinese input>",
  "breakdown": [{"word": "<word>", "pinyin": "<pinyin>", "meaning": "<meaning>"}],
  "notes": "<any important notes about nuance or context>"
}`
        : `Translate from ${from} to ${to}: "${text}"`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a professional Mandarin-English translator with expertise in educational translations.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: includeBreakdown ? { type: 'json_object' } : undefined,
      });

      const result = response.choices[0]?.message?.content || '';

      if (includeBreakdown) {
        return JSON.parse(result);
      }

      return { translation: result, from, to };
    } catch (error) {
      this.logger.error('Translation error', error);
      throw new InternalServerErrorException('Translation failed');
    }
  }

  async explain(userId: string, text: string, type: string, nativeLanguage: string) {
    try {
      const prompt = `Explain this Chinese ${type} to a learner whose native language is ${nativeLanguage}:
"${text}"

Provide a comprehensive explanation in JSON format:
{
  "character": "${text}",
  "pinyin": "<pinyin with tones>",
  "meaning": "<primary meaning>",
  "additionalMeanings": ["<meaning 2>", "<meaning 3>"],
  "radicals": [{"radical": "<radical>", "meaning": "<meaning>"}],
  "strokeOrder": "<description or URL>",
  "examples": [{"sentence": "<Chinese>", "pinyin": "<pinyin>", "translation": "<English>"}],
  "relatedWords": [{"word": "<word>", "pinyin": "<pinyin>", "meaning": "<meaning>"}],
  "memoryTip": "<mnemonic or memory tip>",
  "culturalNote": "<cultural context if relevant>",
  "hskLevel": "<HSK level where this appears>"
}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 800,
        response_format: { type: 'json_object' },
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error) {
      this.logger.error('Explain error', error);
      throw new InternalServerErrorException('Explanation generation failed');
    }
  }

  async generateSentences(word: string, hskLevel: string, count: number, userId: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `Generate ${Math.min(count, 5)} example sentences using "${word}" at ${hskLevel} level.
Return JSON: {
  "word": "${word}",
  "sentences": [{"chinese": "<sentence>", "pinyin": "<pinyin>", "english": "<translation>", "context": "<usage note>"}]
}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 600,
        response_format: { type: 'json_object' },
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error) {
      this.logger.error('Generate sentences error', error);
      throw new InternalServerErrorException('Sentence generation failed');
    }
  }

  async checkGrammar(sentence: string, userId: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `Check the grammar of this Chinese sentence and provide corrections:
"${sentence}"

Return JSON:
{
  "original": "${sentence}",
  "corrected": "<corrected sentence or same if correct>",
  "isCorrect": <boolean>,
  "errors": [{"type": "<error type>", "description": "<description>", "suggestion": "<correction>"}],
  "naturalAlternatives": ["<more natural way to say the same thing>"],
  "explanation": "<overall grammar explanation>"
}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 600,
        response_format: { type: 'json_object' },
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error) {
      this.logger.error('Grammar check error', error);
      throw new InternalServerErrorException('Grammar check failed');
    }
  }

  async getUsageStats(userId: string) {
    return {
      period: new Date().toISOString().slice(0, 7), // YYYY-MM
      chatMessages: { used: 0, limit: AI_LIMITS['free'].chatMessages },
      pronunciationChecks: { used: 0, limit: AI_LIMITS['free'].pronunciationChecks },
    };
  }

  private getOrCreateContext(conversationId: string): any[] {
    if (!this.conversationContexts.has(conversationId)) {
      this.conversationContexts.set(conversationId, []);
    }
    return this.conversationContexts.get(conversationId)!;
  }

  private async checkAiUsageLimit(
    userId: string,
    subscriptionTier: string,
    type: 'chat' | 'pronunciation',
  ): Promise<void> {
    const limits = AI_LIMITS[subscriptionTier as keyof typeof AI_LIMITS] || AI_LIMITS.free;

    // In production, check actual usage from Redis/DB
    const limit = type === 'chat' ? limits.chatMessages : limits.pronunciationChecks;
    if (limit === -1) return; // Unlimited

    // Placeholder: actual check would query Redis counter
  }

  private async trackAiUsage(userId: string, type: string, tokensUsed: number): Promise<void> {
    // In production, increment Redis counter and save to DB
    this.logger.debug(`AI usage tracked: userId=${userId}, type=${type}, tokens=${tokensUsed}`);
  }

  private generateFollowUpSuggestions(userMessage: string, aiResponse: string): string[] {
    const suggestions = [
      'Can you give me more examples?',
      'How do I use this in a conversation?',
      'What are related words?',
      'Can you explain the tones?',
    ];

    // Simple heuristic - in production use AI to generate contextual suggestions
    return suggestions.slice(0, 3);
  }
}
