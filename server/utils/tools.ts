import { Type } from "@google/genai";

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

export const FINANCE_TOOLS_GEMINI = {
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
