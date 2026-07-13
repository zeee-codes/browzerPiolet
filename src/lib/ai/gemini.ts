import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function askGeminiVision(
  prompt: string,
  screenshotBase64: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.");
  }
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const imagePart = {
    inlineData: {
      data: screenshotBase64,
      mimeType: "image/png"
    }
  };

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  return response.text();
}
