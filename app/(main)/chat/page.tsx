"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type MessageType = {
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

const ChatMessage = ({ message }: { message: MessageType }) => {
  return (
    <div
      className={cn(
        "flex w-full max-w-4xl mx-auto p-4 rounded-lg",
        message.role === "assistant" ? "bg-secondary/50" : "bg-background"
      )}
    >
      <div className="flex items-start gap-4 w-full">
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
            message.role === "assistant"
              ? "bg-primary text-primary-foreground"
              : "bg-indigo-600 text-white"
          )}
        >
          {message.role === "assistant" ? "AI" : "U"}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <p className="text-sm font-medium">
            {message.role === "assistant" ? "Assistant" : "You"}
          </p>
          <div className="text-sm">{message.content}</div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([
    {
      content: "Hello! How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: MessageType = {
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: MessageType = {
        content: `I received your message: "${input.trim()}". This is a placeholder response.`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2 items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="shrink-0"
          >
            <Send size={18} />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
