import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface JobMatchRequest {
  userProfile: {
    skills: string[];
    experience: string;
    education: string;
    interests: string[];
  };
  jobListings: Array<{
    id: string;
    title: string;
    description: string;
    requirements: string[];
    location: string;
    salary?: string;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const data: JobMatchRequest = await req.json();

    if (!data.userProfile || !data.jobListings) {
      return NextResponse.json(
        { error: "User profile and job listings are required" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Claude API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `You are an expert AI recruiter for AfriLink Pro. Analyze the following user profile and job listings, then provide a match score (0-100) and explanation for each job.

User Profile:
- Skills: ${data.userProfile.skills.join(", ")}
- Experience: ${data.userProfile.experience}
- Education: ${data.userProfile.education}
- Interests: ${data.userProfile.interests.join(", ")}

Job Listings:
${data.jobListings
  .map(
    (job) => `
  ID: ${job.id}
  Title: ${job.title}
  Description: ${job.description}
  Requirements: ${job.requirements.join(", ")}
  Location: ${job.location}
  Salary: ${job.salary || "Not specified"}
`
  }
  .join("\n")}

For each job, provide:
1. Match Score (0-100)
2. Key matching points
3. Gaps or concerns
4. Recommendations

Respond in JSON format with an array of matches.`;

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
    let matches;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      matches = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: content };
    } catch {
      matches = { raw: content };
    }

    return NextResponse.json({
      matches,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error("Job matching error:", error);
    return NextResponse.json(
      { error: "Failed to process job matching" },
      { status: 500 }
    );
  }
}
