import { NextRequest, NextResponse } from "next/server";
import { uploadSnapToAI } from "@/server/chat";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!["image/jpeg", "image/png"].includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 },
      );
    }

    const result = await uploadSnapToAI(imageFile);
    if (!result) {
      return NextResponse.json({ error: "AI parsing failed" }, { status: 500 });
    }

    try {
      const parsed = JSON.parse(result);
      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json(
        { error: "Invalid AI response format" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
