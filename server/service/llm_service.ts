import { Readable } from "stream";
import OpenAI from "openai";
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";
import { storeFinance } from "../supabase/fetchData";

interface chatGroqOrOpenAI {
  client: any;
  model: string;
  messages: any[];
  tools: any[];
  availableFunctions?: Record<string, Function>;
}

interface chatGoogle {
  client: GoogleGenAI;
  model: string;
  messages: any[];
  config: any;
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
    return { client, model: "gemini-2.5-pro" };
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
  tools,
  availableFunctions = {},
}: chatGroqOrOpenAI): Promise<Readable> {
  const response = await client.chat.completions.create({
    model,
    messages,
    tools: tools,
    tool_choice: "auto",
    stream: false,
  });
  const responseMessage = response.choices[0].message;
  const toolCalls = responseMessage.tool_calls;

  if (toolCalls && toolCalls.length > 0) {
    messages.push(responseMessage);

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const func = availableFunctions[functionName];
      const args = JSON.parse(toolCall.function.arguments);

      if (func) {
        const result = await func(args.data);
        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify(result),
        });
      }
    }
  } else {
    return streamGroqOrOpenAI(
      await client.chat.completions.create({
        model,
        messages,
        stream: true,
      }),
    );
  }

  const streamResponse = await client.chat.completions.create({
    model,
    messages,
    stream: true,
  });

  return streamGroqOrOpenAI(streamResponse);
}

export async function handleGoogleResponse({
  client,
  model,
  messages,
  config,
}: chatGoogle): Promise<Readable> {
  const result = await client.models.generateContent({
    model: model,
    contents: messages,
    config: config,
  });

  const toolCalls = result.functionCalls;

  let function_response_parts: any[] = [];

  if (toolCalls && toolCalls.length > 0) {
    for (const toolCall of toolCalls) {
      if (toolCall.name === "storeFinance") {
        const args = toolCall.args as { data: string };
        const response = await storeFinance(args.data);
        function_response_parts.push({
          functionResponse: {
            name: toolCall.name,
            response: { content: JSON.stringify(response) },
          },
        });
      }
    }

    const finalStreamGenerator = await client.models.generateContentStream({
      model: model,
      contents: [
        ...messages,
        {
          role: "model",
          parts: function_response_parts,
        },
      ],
    });

    return streamGoogle(finalStreamGenerator);
  } else {
    const streamGenerator = await client.models.generateContentStream({
      model: model,
      contents: messages,
    });

    return streamGoogle(streamGenerator);
  }
}
