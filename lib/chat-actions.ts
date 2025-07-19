"use server";
import { chatWithStream, uploadSnapToAI } from "@/server/chat";
import { createClient } from "@/utils/supabase/server";

export async function streamChatAction(
  query: string,
  provider: "groq" | "openai" | "google" = "groq",
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const stream = await chatWithStream(provider, query);

    return new Promise<string>((resolve, reject) => {
      let fullResponse = "";

      stream.on("data", (chunk) => {
        fullResponse += chunk.toString();
      });

      stream.on("end", () => {
        resolve(fullResponse);
      });

      stream.on("error", (error) => {
        console.error("Stream error:", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error("Error in chat stream:", error);
    throw error;
  }
}

export async function uploadImageAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      throw new Error("No image provided");
    }

    if (!["image/jpeg", "image/png"].includes(imageFile.type)) {
      throw new Error("Invalid image format. Only JPEG and PNG are supported.");
    }

    const result = await uploadSnapToAI(imageFile);
    if (!result) {
      throw new Error("AI parsing failed");
    }

    try {
      const parsed = JSON.parse(result);
      return parsed;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      throw new Error("Invalid AI response format");
    }
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
