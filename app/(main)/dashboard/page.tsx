import React, { Suspense } from "react";
import ExpenseStats from "@/features/dashboard/components/expensestats";
import SnapUpload from "@/components/camera";
import TopSpentCategories from "@/features/dashboard/components/mostspent";
import WelcomeText from "@/features/dashboard/components/welcometext";
import { WelcomeTextSkeleton } from "@/components/skeleton/welcometext-skeleton";
import NewAddExpenseModalButton from "@/features/dashboard/components/newModal";
import { TransactionCard } from "@/features/dashboard/components/recentexpense";
import { SpendingHeatmap } from "@/features/dashboard/components/heatmap";

export default async function page() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center md:flex-row flex-col">
        <Suspense fallback={<WelcomeTextSkeleton />}>
          <WelcomeText />
        </Suspense>

        <div className="flex gap-2 md:mt-0 mt-5 items-center">
          <NewAddExpenseModalButton />
          <SnapUpload />
        </div>
      </div>
      <Suspense fallback={<WelcomeTextSkeleton />}>
        <ExpenseStats />
      </Suspense>
      <div className="flex gap-4 md:flex-row flex-col">
        <Suspense fallback={<WelcomeTextSkeleton />}>
          <SpendingHeatmap />
        </Suspense>
        <div className="grow flex gap-4 flex-col">
          <div className="">
            <TopSpentCategories />
          </div>

          <div className="">
            <TransactionCard />
          </div>
        </div>
      </div>
    </div>
  );
}
