import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();

    // Validate input early
    if (!jobPosition || !jobDescription || !duration || !type) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Clean and generate the final prompt
    const FINAL_PROMPT = QUESTIONS_PROMPT.replace(/{{jobTitle}}/g, jobPosition)
      .replace(/{{jobDescription}}/g, jobDescription)
      .replace(/{{duration}}/g, duration)
      .replace(/{{type}}/g, type);

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    const aiMessage = completion?.choices?.[0]?.message;

    if (!aiMessage) {
      return NextResponse.json(
        { error: "No content returned from AI." },
        { status: 500 }
      );
    }

    return NextResponse.json(aiMessage);
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
