import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface ResumeAnalysisRequest {
  resumeText: string;
  targetRole?: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: ResumeAnalysisRequest = await req.json();

    if (!data.resumeText) {
      return NextResponse.json(
        { error: "Resume text is required" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Claude API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `Analyze this resume and provide insights for an African professional job market:

${data.resumeText}

${data.targetRole ? `Target Role: ${data.targetRole}\n` : ""}

Provide analysis in the following JSON format:
{
  "summary": "Brief professional summary",
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["improvement 1", "improvement 2", ...],
  "skills_identified": ["skill 1", "skill 2", ...],
  "experience_level": "junior|mid|senior|executive",
  "recommended_roles": ["role 1", "role 2", ...],
  "market_fit_africa": "score 0-100 with explanation",
  "recommendations": ["recommendation 1", "recommendation 2", ...]
}`;

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === "text");
    const content = textContent && "text" in textContent ? textContent.text : "";

    // Parse JSON response
    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: content };
    } catch {
      analysis = { raw: content };
    }

    return NextResponse.json({
      analysis,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
