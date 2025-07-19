"use client";
import { uploadImageAction } from "@/lib/chat-actions";

export async function uploadImageSnap(file: File) {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const result = await uploadImageAction(formData);
    return result;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
