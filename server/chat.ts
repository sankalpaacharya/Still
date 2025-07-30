import { system_prompt } from "./prompts/prompt3";
import { buildImagePrompt } from "./prompts/image_prompt";
import { getFullUserInfo } from "../features/chat/actions/index";
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";
import { Readable } from "stream";
import {
  getLLMClientAndModel,
  handleGroqOrOpenAIResponse,
  handleGoogleResponse,
} from "./service/llm_service";
import { getCategories } from "@/features/dashboard/actions/index";

export async function chatWithStream(
  provider: "groq" | "openai" | "google",
  query: string,
): Promise<Readable> {
  const { client, model } = getLLMClientAndModel(provider);
  const financeData = await getFullUserInfo();
  console.log("Finance Data:", financeData);
  const prompt = system_prompt({
    finance_data: JSON.stringify(financeData),
    query,
  });

  let messages: any[] = [
    { role: "system", content: prompt },
    { role: "user", content: query },
  ];

  if (provider === "openai" || provider === "groq") {
    return await handleGroqOrOpenAIResponse({
      client,
      model,
      messages,
    });
  } else if (provider === "google") {
    const googleClient = client as GoogleGenAI;

    const googleMessages = messages.map((msg) => ({
      role: msg.role === "system" ? "user" : msg.role,
      parts: [{ text: msg.content }],
    }));

    try {
      const result = await handleGoogleResponse({
        client: googleClient,
        model,
        messages: googleMessages,
      });
      return result;
    } catch (error) {
      console.error("Google AI API error:", error);
      throw error;
    }
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

export async function uploadSnapToAI(file: File): Promise<string | null> {
  try {
    const { client, model } = getLLMClientAndModel("openai");
    const groqClient = client as Groq;

    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const contentType = file.type;
    const imageDataUrl = `data:${contentType};base64,${base64Image}`;

    const categories = await getCategories();
    const userData = await getFullUserInfo();

    const imagePrompt = buildImagePrompt({
      user_data: JSON.stringify(userData),
      categories: JSON.stringify(categories),
    });

    const response = await groqClient.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: imagePrompt },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content ?? null;
  } catch (error) {
    console.error("Image upload to AI failed:", error);
    return null;
  }
}
