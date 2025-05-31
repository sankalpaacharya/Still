import React from "react";
import ChatInput from "@/features/chat/components/chat-input";
import Conversation from "@/features/chat/components/coversation";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {};

export default function Page() {
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1  h-[800px] p-10">
        <Conversation isUser={false} />
      </ScrollArea>
      <ChatInput />
    </div>
  );
}
