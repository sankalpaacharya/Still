"use client";
import React from "react";
import Markdown from "react-markdown";
import { Sparkles } from "lucide-react";
import remarkGfm from "remark-gfm";

type Props = { isUser: boolean; message: string };

export default function Message({ isUser, message }: Props) {
  const essay = `# Nepal: A Land of Natural Beauty and Cultural Heritage
Nepal, a landlocked country located in South Asia, is known for its breathtaking landscapes, rich cultural heritage, and ancient history. Nestled between India and China, it is home to some of the world's tallest peaks, including the majestic Mount Everest, the highest point on Earth.

## Geography and Natural Beauty

Nepal is often referred to as a "living paradise" due to its stunning natural beauty. The country's geography is incredibly diverse, ranging from the flat plains of the Terai region to the towering peaks of the Himalayas.

## Cultural Heritage

Nepal is a melting pot of cultures and traditions. The country is home to various ethnic groups, including the Gurungs, Magars, Newars, Sherpas, and many more. Each group has its own unique language, customs, and traditions.`;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      {isUser ? (
        <div className="flex justify-end">
          <div className="bg-gray-400/10 p-3 rounded-xl max-w-md border flex shadow-md">
            <p className="text-lg font-medium">{message}</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="max-w-3xl">
            <div className="flex gap-2 items-center mb-3">
              <Sparkles size={20} className="text-pink-400" />
              <p className="font-bold">Sanku</p>
            </div>
            <div className="prose prose-slate dark:prose-invert prose-xl text-white prose-li:marker:text-pink-400  max-w-4xl px-3">
              <Markdown remarkPlugins={[remarkGfm]}>{message}</Markdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
