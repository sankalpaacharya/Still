import React from "react";
import ExpenseStats from "@/features/dashboard/components/expensestats";
import SnapUpload from "@/components/camera";
import TopSpentCategories from "@/features/dashboard/components/mostspent";
import WelcomeText from "@/features/dashboard/components/welcometext";
import { Suspense } from "react";
import { WelcomeTextSkeleton } from "@/components/skeleton/welcometext-skeleton";
import NewAddExpenseModalButton from "@/features/dashboard/components/newModal";
import { TransactionCard } from "@/features/dashboard/components/recentexpense";

export default async function page() {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Suspense fallback={<WelcomeTextSkeleton />}>
          <WelcomeText />
        </Suspense>
        <NewAddExpenseModalButton />
      </div>
      <ExpenseStats />
      <div className="space-y-5">
        <TransactionCard />

        <TopSpentCategories />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SnapUpload />
      </div>
    </div>
  );
}
