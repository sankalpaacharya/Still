import React from "react";
import ChatInput from "@/features/chat/components/chat-input";

type Props = {};

export default function Page({}: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1"></div>
      <ChatInput />
    </div>
  );
}
