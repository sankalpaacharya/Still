import { Readable } from "stream";
import OpenAI from "openai";
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";

interface chatGroqOrOpenAI {
  client: any;
  model: string;
  messages: any[];
}

interface chatGoogle {
  client: GoogleGenAI;
  model: string;
  messages: any[];
}

export function getLLMClientAndModel(provider: "groq" | "openai" | "google") {
  if (provider === "openai") {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    return { client, model: "gpt-4o" };
  }
  if (provider === "groq") {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });
    return { client, model: "meta-llama/llama-4-scout-17b-16e-instruct" };
  }
  if (provider === "google") {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    return { client, model: "gemini-2.5-flash" };
  }
  throw new Error(`Unsupported provider: ${provider}`);
}

export function streamGroqOrOpenAI(streamResponse: any): Readable {
  const stream = new Readable({
    read() {},
  });

  const processStream = async () => {
    try {
      for await (const chunk of streamResponse) {
        const delta = chunk.choices[0]?.delta;
        if (delta?.content) {
          stream.push(delta.content);
        }
      }
      stream.push(null);
    } catch (error) {
      stream.destroy(error as Error);
    }
  };

  processStream();
  return stream;
}

export function streamGoogle(streamResponse: any): Readable {
  const stream = new Readable({
    read() {},
  });

  const processStream = async () => {
    try {
      for await (const chunk of streamResponse) {
        const text = chunk.text;
        if (text) {
          stream.push(text);
        }
      }
      stream.push(null);
    } catch (error) {
      stream.destroy(error as Error);
    }
  };

  processStream();
  return stream;
}

export async function handleGroqOrOpenAIResponse({
  client,
  model,
  messages,
}: chatGroqOrOpenAI): Promise<Readable> {
  const streamResponse = await client.chat.completions.create({
    model,
    messages,
    max_completion_tokens: 1000,
    stream: true,
  });

  return streamGroqOrOpenAI(streamResponse);
}

export async function handleGoogleResponse({
  client,
  model,
  messages,
}: chatGoogle): Promise<Readable> {
  const streamGenerator = await client.models.generateContentStream({
    model: model,
    contents: messages,
    config: {
      maxOutputTokens: 1000,
    },
  });

  return streamGoogle(streamGenerator);
}

export async function handleEditResponse({
  client,
  model,
  messages,
}: chatGroqOrOpenAI) {
  const response = await client.chat.completions.create({
    model,
    messages,
  });
  console.log(response.choices[0]?.message?.content);
  return response.choices[0]?.message?.content;
}
