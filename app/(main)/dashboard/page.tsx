import React, { Suspense } from "react";
import ExpenseStats from "@/features/dashboard/components/expensestats";
import SnapUpload from "@/components/camera";
import TopSpentCategories from "@/features/dashboard/components/mostspent";
import WelcomeText from "@/features/dashboard/components/welcometext";
import { WelcomeTextSkeleton } from "@/components/skeleton/welcometext-skeleton";
import NewAddExpenseModalButton from "@/features/dashboard/components/newModal";
import { TransactionCard } from "@/features/dashboard/components/recentexpense";

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

      <ExpenseStats />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="order-1 md:order-none">
          <TopSpentCategories />
        </div>

        <div className="order-2 md:order-none md:col-span-2 space-y-4">
          <TransactionCard />
        </div>
      </div>
    </div>
  );
}
