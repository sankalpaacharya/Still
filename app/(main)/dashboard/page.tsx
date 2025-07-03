import React, { Suspense } from "react";
import ExpenseStats from "@/features/dashboard/components/expensestats";
import SnapUpload from "@/components/camera";
import TopSpentCategories from "@/features/dashboard/components/mostspent";
import WelcomeText from "@/features/dashboard/components/welcometext";
import { WelcomeTextSkeleton } from "@/components/skeleton/welcometext-skeleton";
import NewAddExpenseModalButton from "@/features/dashboard/components/newModal";
import { TransactionCard } from "@/features/dashboard/components/recentexpense";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export default async function page() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <Suspense fallback={<WelcomeTextSkeleton />}>
          <WelcomeText />
        </Suspense>

        {/* Action Buttons Group */}
        <div className="flex gap-2">
          {/* Add Expense Button */}
          <NewAddExpenseModalButton />

          {/* Upload via Camera Button (wrapped SnapUpload) */}
          <SnapUpload />
        </div>
      </div>

      {/* Stats Overview */}
      <ExpenseStats />

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <TransactionCard />
        </div>

        {/* Right: Most Spent Categories */}
        <div>
          <TopSpentCategories />
        </div>
      </div>
    </div>
  );
}
