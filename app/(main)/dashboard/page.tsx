import React from "react";
import ExpenseStats from "@/features/dashboard/components/expensestats";
import AddExpenseModalButton from "@/features/dashboard/components/addexpensebutton";
import SnapUpload from "@/components/camera";
import TopSpentCategories from "@/features/dashboard/components/mostspent";
import WelcomeText from "@/features/dashboard/components/welcometext";
import { Suspense } from "react";
import { WelcomeTextSkeleton } from "@/components/skeleton/welcometext-skeleton";
import { recalculateAmount } from "@/features/cashflow/actions";

export default async function page() {
  const expenses = await recalculateAmount({ accountID: "something here" });
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Suspense fallback={<WelcomeTextSkeleton />}>
          <WelcomeText />
        </Suspense>
        <AddExpenseModalButton />
      </div>
      <ExpenseStats />
      <TopSpentCategories />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SnapUpload />
      </div>
    </div>
  );
}
