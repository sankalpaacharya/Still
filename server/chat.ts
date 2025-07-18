// import { system_prompt } from "./prompts/prompts";
import { system_prompt } from "./prompts/prompt2";
import { buildImagePrompt } from "./prompts/image_prompt";
import {
  getFullUserInfo,
  storeFinance,
  getCategories,
} from "./supabase/fetchData";
import { OpenAI } from "openai";
import Groq from "groq-sdk";
import { GoogleGenAI, Type } from "@google/genai";
import { Readable } from "stream";

export const FINANCE_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "storeFinance",
      description: "Store data from LLM to supabase",
      parameters: {
        type: "object",
        properties: {
          data: {
            type: "string",
            description: "Data to be stored in supabase",
          },
        },
        required: ["data"],
      },
    },
  },
];

const FINANCE_TOOLS_GEMINI = {
  name: "storeFinance",
  description: "Store data from LLM to supabase",
  parameters: {
    type: Type.OBJECT,
    properties: {
      data: {
        type: Type.STRING,
        description: "Data to be stored in supabase",
      },
    },
    required: ["data"],
  },
};

function getLLMClientAndModel(provider: "groq" | "openai" | "google") {
  if (provider === "openai") {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    return { client, model: "gpt-4o" };
  }
  if (provider === "groq") {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });
    return { client, model: "meta-llama/llama-4-scout-17b-16e-instruct" };
  }
  if (provider === "google") {
    const client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
    return { client, model: "gemini-2.5-pro" };
  }
  throw new Error(`Unsupported provider: ${provider}`);
}

function streamGroqOrOpenAI(streamResponse: any): Readable {
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

export async function chatWithStream(
  provider: "groq" | "openai" | "google",
  query: string,
): Promise<Readable> {
  const { client, model } = getLLMClientAndModel(provider);
  const financeData = await getFullUserInfo();

  const prompt = system_prompt({
    finance_data: JSON.stringify(financeData),
    query,
  });

  let messages: any[] = [
    { role: "system", content: prompt },
    { role: "user", content: query },
  ];

  const availableFunctions: Record<string, Function> = {
    storeFinance: storeFinance,
  };

  if (provider === "openai") {
    const openaiClient = client as OpenAI;

    const response = await openaiClient.chat.completions.create({
      model,
      messages,
      tools: FINANCE_TOOLS,
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
        await openaiClient.chat.completions.create({
          model,
          messages,
          stream: true,
        }),
      );
    }

    const streamResponse = await openaiClient.chat.completions.create({
      model,
      messages,
      stream: true,
    });

    return streamGroqOrOpenAI(streamResponse);
  } else if (provider === "groq") {
    const groqClient = client as Groq;

    const response = await groqClient.chat.completions.create({
      model,
      messages,
      tools: FINANCE_TOOLS,
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
        await groqClient.chat.completions.create({
          model,
          messages,
          stream: true,
        }),
      );
    }

    const streamResponse = await groqClient.chat.completions.create({
      model,
      messages,
      stream: true,
    });

    return streamGroqOrOpenAI(streamResponse);
  } else if (provider === "google") {
    const googleClient = client as GoogleGenAI;

    const googleMessages = messages.map((msg) => ({
      role: msg.role === "system" ? "user" : msg.role,
      parts: [{ text: msg.content }],
    }));

    const config = {
      tools: [{ functionDeclarations: [FINANCE_TOOLS_GEMINI] }],
    };

    try {
      const result = await googleClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: googleMessages,
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

        const finalStreamGenerator =
          await googleClient.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: [
              ...googleMessages,
              {
                role: "model",
                parts: function_response_parts,
              },
            ],
          });

        const stream = new Readable({
          read() {},
        });

        const processGoogleStream = async () => {
          try {
            for await (const chunk of finalStreamGenerator) {
              const chunkText = chunk.text;
              if (chunkText) {
                stream.push(chunkText);
              }
            }
            stream.push(null);
          } catch (error) {
            stream.destroy(error as Error);
          }
        };

        processGoogleStream();
        return stream;
      } else {
        const streamGenerator = await googleClient.models.generateContentStream(
          {
            model: "gemini-2.5-flash",
            contents: googleMessages,
          },
        );

        const stream = new Readable({
          read() {},
        });

        const processGoogleStream = async () => {
          try {
            for await (const chunk of streamGenerator) {
              const chunkText = chunk.text;
              if (chunkText) {
                stream.push(chunkText);
              }
            }
            stream.push(null);
          } catch (error) {
            stream.destroy(error as Error);
          }
        };

        processGoogleStream();
        return stream;
      }
    } catch (error) {
      console.error("Google AI API error:", error);
      throw error;
    }
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

export async function uploadSnapToAI(file: File): Promise<string | null> {
  try {
    const { client, model } = getLLMClientAndModel("groq");
    const groqClient = client as Groq;

    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const contentType = file.type;
    const imageDataUrl = `data:${contentType};base64,${base64Image}`;

    const [categories] = await getCategories();
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
