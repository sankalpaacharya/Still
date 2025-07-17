"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
} from "@/components/ui/emoji-picker";
import CategoryCard from "@/features/categories/components/category-card";

export default function Page() {
  return (
    <main className="p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Your Categories</h1>
        <p className="text-muted-foreground text-sm">
          A summary of all your expense categories with budget usage and trends.
        </p>
      </div>

      <CategoryCard
        name="Food & Dining"
        icon="🍔"
        currentAmount={1240}
        budgetAmount={1800}
        transactionCount={14}
        trend={{ direction: "up", percentage: 12 }}
        gradient="from-blue-500 to-blue-400"
      />

      {/* <EmojiPicker
        className="h-[326px] rounded-lg border shadow-md"
        onEmojiSelect={({ emoji }) => {
          console.log(emoji);
        }}
      >
        <EmojiPickerSearch />
        <EmojiPickerContent />
      </EmojiPicker> */}
    </main>
  );
}
