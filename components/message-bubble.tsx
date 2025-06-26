import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
  message: string;
};

export default function MessageBubble({ className, message }: Props) {
  return (
    <div
      className={cn(
        "relative max-w-xs md:max-w-sm p-3 text-white rounded-xl shadow-md",
        "bg-white/10 backdrop-blur-sm self-start",
        className
      )}
    >
      {message}
      <div
        className={cn(
          "absolute top-2 w-0 h-0 border-t-8 border-b-8",
          "left-[-8px] border-r-8 border-r-white/10 border-t-transparent border-b-transparent"
        )}
      />
    </div>
  );
}
