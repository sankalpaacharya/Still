// app/features/cashflow/components/grouped-expenses.tsx
import React from "react";
import { getExpenses } from "../actions";
import ExpenseGroup from "./display-table-wrapper";

export default async function GroupedExpenses() {
  const expenses = await getExpenses();

  const hasExpenses = Object.keys(expenses).length > 0;

  return (
    <div className="space-y-8 mb-10">
      {hasExpenses ? (
        Object.entries(expenses).map(([groupName, expenseList]) => (
          <ExpenseGroup
            key={groupName}
            name={groupName}
            expenses={expenseList}
          />
        ))
      ) : (
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
            Start tracking your expenses by adding your first transaction.
          </p>
        </div>
      )}
    </div>
  );
}
