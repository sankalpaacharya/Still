"use client";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Sparkles } from "lucide-react";
import remarkGfm from "remark-gfm";

type Props = {
  isUser: boolean;
  message: string;
};

export default function StreamingMessage({ isUser, message }: Props) {
  const [displayedMessage, setDisplayedMessage] = useState("");

  useEffect(() => {
    setDisplayedMessage(message);
  }, [message]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      {isUser ? (
        <div className="flex justify-end">
          <div className="bg-gray-400/10 p-3 rounded-xl max-w-md border flex shadow-md">
            <p className="text-lg font-medium">{displayedMessage}</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="max-w-3xl">
            <div className="flex gap-2 items-center mb-3">
              <Sparkles size={20} className="text-pink-400" />
              <p className="font-bold">Sanku</p>
            </div>
            <div className="prose prose-slate dark:prose-invert prose-xl text-white prose-li:marker:text-pink-400 max-w-4xl px-3">
              <Markdown components={{}} remarkPlugins={[remarkGfm]}>
                {displayedMessage}
              </Markdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
