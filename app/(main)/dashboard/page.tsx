import React from "react";
import ExpenseStats from "@/features/dashboard/components/expensestats";
import SnapUpload from "@/components/camera";
import TopSpentCategories from "@/features/dashboard/components/mostspent";
import WelcomeText from "@/features/dashboard/components/welcometext";
import { Suspense } from "react";
import { WelcomeTextSkeleton } from "@/components/skeleton/welcometext-skeleton";
import NewAddExpenseModalButton from "@/features/dashboard/components/newModal";
import { mostSpentCategory } from "@/features/dashboard/actions";

export default async function page() {
  const expenses = await mostSpentCategory();
  console.log("fucking expenses", expenses);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Suspense fallback={<WelcomeTextSkeleton />}>
          <WelcomeText />
        </Suspense>
        <NewAddExpenseModalButton />
      </div>

      <ExpenseStats />

      {/* Welcome Message */}
      {/* <div className="mb-8">
        <TextGenerateEffect
          duration={2}
          filter={false}
          words={
            "Even ₹50 spent consciously can build a mindset of wealth. Let’s stay intentional, Sankalpa"
          }
          className="text-2xl font-semibold text-gray-900 dark:text-gray-100"
        />
      </div> */}

      <TopSpentCategories />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SnapUpload />
      </div>
    </div>
  );
}
