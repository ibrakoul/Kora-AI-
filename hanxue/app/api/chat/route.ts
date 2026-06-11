import { NextRequest, NextResponse } from 'next/server';

const SYSTEM = `You are Mei, a warm and encouraging Mandarin Chinese tutor inside SinoFlow app.
Rules:
- Reply in 2-3 sentences max.
- Always include one Chinese phrase with pinyin in parentheses.
- If the user writes in Chinese, praise them and gently correct errors.
- Be warm and encouraging. Use emojis sparingly (max one per reply).
- Format: Chinese characters (pīnyīn) = English meaning.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 503 });
  }

  const { history } = await req.json() as { history: { role: string; content: string }[] };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: SYSTEM,
      messages: history,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
  }

  const data = await res.json() as { content: { text: string }[] };
  return NextResponse.json({ reply: data.content?.[0]?.text ?? '' });
}
