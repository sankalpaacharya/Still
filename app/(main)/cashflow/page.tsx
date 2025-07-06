import React from "react";
import { Suspense } from "react";
import { ExpenseGroupSkeleton } from "@/components/skeleton/expenses-skeleton";
import DisplayTable from "@/features/cashflow/components/data-table";

export default async function Page() {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 max-h-screen overflow-y-auto">
      <div className="sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Expenses
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                Track and manage your spending
              </p>
            </div>
          </div>
        </div>
        <Suspense fallback={<ExpenseGroupSkeleton />}>
          <DisplayTable />
        </Suspense>
      </div>
    </div>
  );
}
