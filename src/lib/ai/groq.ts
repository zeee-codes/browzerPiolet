import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export async function askGroqVision(
  prompt: string,
  screenshotBase64: string
): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not defined in environment variables.");
  }

  const response = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${screenshotBase64}`,
            },
          },
        ],
      },
    ],
    max_tokens: 1024,
    temperature: 0.1,
  });

  return response.choices[0]?.message?.content || "";
}
