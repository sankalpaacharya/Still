"use client";
import React, { useRef, useState } from "react";
import ChatInput from "@/features/chat/components/chat-input";
import Message from "@/features/chat/components/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { streamChatAction } from "@/lib/chat-actions";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

type ChatHistory = {
  role: "user" | "ai";
  message: string;
};

export default function Page() {
  const [response, setResponse] = useState<string>("");
  const responseRef = useRef<string>("");
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const currentUserMessageRef = useRef<HTMLDivElement>(null);

  const scrollToCurrentExchange = () => {
    setTimeout(() => {
      currentUserMessageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }, 100);
  };

  const handleMessageSend = async (
    message: string,
    provider: string = "groq",
  ) => {
    setResponse("");
    responseRef.current = "";
    setIsStreaming(true);

    setChatHistory((prev) => [...prev, { role: "user", message }]);

    scrollToCurrentExchange();

    try {
      const aiResponse = await streamChatAction(
        message,
        provider as "groq" | "openai" | "google",
      );

      setResponse(aiResponse);
      responseRef.current = aiResponse;

      setChatHistory((prev) => [...prev, { role: "ai", message: aiResponse }]);
      setIsStreaming(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsStreaming(false);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          message: "Sorry, there was an error processing your request.",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="gradient-bg absolute inset-0 left-30" />
      <StarsBackground starDensity={0.000016} />
      <ShootingStars />
      <div className="relative z-20 flex flex-col h-full">
        {chatHistory.length === 0 && (
          <section className="flex-1">
            <div className="flex flex-col justify-center items-center h-full gap-10">
              <h2 className="text-3xl font-bold">How can I help you?</h2>
              <ChatInput
                onMessageSend={handleMessageSend}
                disabled={isStreaming}
              />
            </div>
          </section>
        )}

        {chatHistory.length !== 0 && (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 h-[800px] p-10">
              <div className="space-y-6">
                {chatHistory.map((chat, index) => {
                  const isLatestUserMessage =
                    chat.role === "user" && index === chatHistory.length - 1;
                  const isCurrentUserMessage =
                    chat.role === "user" &&
                    isStreaming &&
                    index === chatHistory.length - 1;

                  return (
                    <div
                      key={index}
                      ref={
                        isLatestUserMessage || isCurrentUserMessage
                          ? currentUserMessageRef
                          : null
                      }
                    >
                      <Message
                        isUser={chat.role === "user"}
                        message={chat.message}
                      />
                    </div>
                  );
                })}

                {isStreaming && (
                  <Message isUser={false} message={response || "Thinking..."} />
                )}
              </div>
            </ScrollArea>
            <ChatInput
              onMessageSend={handleMessageSend}
              disabled={isStreaming}
            />
          </div>
        )}
      </div>
    </div>
  );
}
