import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  try {
    const { noteContent, type, topic } = await req.json();

    if (!noteContent) {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = "";
    if (type === "Flashcard") {
      prompt = `
        You are an expert tutor. Based on the following note content about "${topic}", generate exactly 10 high-quality flashcards.
        The output MUST be a valid JSON array of objects with the following structure:
        [
          { "front": "question or concept", "back": "answer or explanation" }
        ]
        
        Note Content:
        ${noteContent}
        
        Strictly return ONLY the JSON array. Do not include any markdown formatting like \`\`\`json or regular text.
      `;
    } else if (type === "Optimize") {
      prompt = `
        You are an expert editor and subject matter expert. Your goal is to optimize the following learning notes.
        
        Task:
        1.  **Factual Verification**: Check the notes for any factual inaccuracies.
        2.  **Correction Notice**: If you find any factual errors, you MUST prepend a notification at the very beginning of the HTML. Use this exact Indonesian format:
            <div style="background-color: #FFF9C4; border: 2px solid #FBC02D; padding: 12px; border-radius: 12px; margin-bottom: 20px; font-weight: bold; color: #455A64;">
                ⚠️ AI Correction: Catatan kamu yang "[bagian yang salah]" kurang tepat. AI telah mengoreksinya menjadi "[koreksinya]".
            </div>
        3.  **Refine Content**: Improve grammar, punctuation, and flow.
        4.  **Enhance Formatting**: Use HTML tags properly (<strong>, <em>, <u>, <ul>, <ol>, <li>, <h2>).
        5.  **Preserve Meaning**: Keep all original information, but ensure it is factually correct.
        6.  **Style**: Professional, clean, and extremely easy to read.
        
        Original Note Content:
        ${noteContent}
        
        Return ONLY the resulting HTML string. Do not include markdown code blocks.
      `;
    } else {
      prompt = `
        You are an expert tutor. Based on the following note content about "${topic}", generate exactly 5 multiple-choice questions.
        The output MUST be a valid JSON array of objects with the following structure:
        [
          {
            "text": "The question text",
            "options": [
              { "id": "A", "text": "Option A text", "isCorrect": true/false },
              { "id": "B", "text": "Option B text", "isCorrect": true/false },
              { "id": "C", "text": "Option C text", "isCorrect": true/false },
              { "id": "D", "text": "Option D text", "isCorrect": true/false }
            ],
            "hint": "A helpful hint for this question",
            "category": "Concepts" | "Memory" | "Logic" | "Speed" | "Accuracy"
          }
        ]
        
        Ensure exactly one option is correct per question.
        Note Content:
        ${noteContent}
        
        Strictly return ONLY the JSON array. Do not include any markdown formatting like \`\`\`json or regular text.
      `;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Attempt to clean the response if Gemini includes markdown blocks
    let cleanText = text
      .replace(/```json/g, "")
      .replace(/```html/g, "")
      .replace(/```/g, "")
      .trim();

    if (type === "Optimize") {
      return NextResponse.json({ optimizedContent: cleanText });
    }

    try {
      const parsedData = JSON.parse(cleanText);
      return NextResponse.json(parsedData);
    } catch (parseError: unknown) {
      const errorMessage =
        parseError instanceof Error ? parseError.message : String(parseError);
      console.error("Failed to parse Gemini response:", text, errorMessage);
      return NextResponse.json(
        { error: "AI returned invalid format. Please try again.", raw: text },
        { status: 500 },
      );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate content";
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
