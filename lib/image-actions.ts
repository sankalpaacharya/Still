"use server";
import { uploadSnapToAI } from "@/server/chat";
import { createClient } from "@/utils/supabase/server";

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
      if ("error" in parsed) {
        throw new Error(parsed.error);
      }
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
