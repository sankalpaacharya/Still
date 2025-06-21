import React from "react";
import DataTable from "@/features/cashflow/components/data-table";
import { columns } from "@/features/cashflow/components/columns";
import { getExpenses } from "@/features/cashflow/actions";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page() {
  const expenses = await getExpenses();
  const totalExpenses = Object.values(expenses).flat().length;
  const totalAmount = Object.values(expenses)
    .flat()
    .reduce((sum, expense) => sum + expense.amount, 0);

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

            <div className="flex items-center space-x-4">
              <div className="text-right"></div>
              <div className="text-right">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Total Amount
                </div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  NPR{" "}
                  {Math.abs(totalAmount).toLocaleString("en-NP", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <ScrollArea className="max-h-screen overflow-y-auto p-3"> */}
        <div className="space-y-8">
          {Object.entries(expenses).map(([groupName, expenseList]) => (
            <div key={groupName} className="space-y-4">
              {/* Group Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {groupName}
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    {expenseList.length}{" "}
                    {expenseList.length === 1 ? "expense" : "expenses"}
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-sm text-zinc-500 dark:text-zinc-400">
                    NPR{" "}
                    {expenseList
                      .reduce(
                        (sum, expense) => sum + Math.abs(expense.amount),
                        0
                      )
                      .toLocaleString("en-NP", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </div>
                </div>
              </div>

              {/* Expense Table */}
              <div className="bg-white w-full dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                <div className="p-6">
                  <DataTable columns={columns} data={expenseList} />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* </ScrollArea> */}
        {/* Empty State */}
        {Object.keys(expenses).length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
              <svg
                className="w-12 h-12 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              No expenses yet
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
              Start tracking your expenses by adding your first transaction. All
              your spending will be organized and displayed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
