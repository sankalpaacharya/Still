import React from "react";
import { getExpenses } from "../actions";
import { ExpenseRow } from "./transactions-row";

export default async function DisplayTable() {
  const expenses = await getExpenses();

  return (
    <div className="space-y-6 mb-10">
      {Object.entries(expenses).map(([groupName, expenseList]) => (
        <div key={groupName} className="space-y-3">
          {/* Group Header */}
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-foreground">
                {groupName}
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {expenseList.length}
              </span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm text-muted-foreground">
                NPR{" "}
                {expenseList
                  .reduce((sum, expense) => sum + Math.abs(expense.amount), 0)
                  .toLocaleString("en-NP", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
              </div>
            </div>
          </div>

          {/* Compact Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Table Header - Only visible on larger screens */}
            <div className="hidden md:flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="flex-1">Transaction</div>
              <div className="w-24 text-right">Amount</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
              {expenseList.map((expense) => (
                <ExpenseRow
                  key={expense.id}
                  row={{
                    original: expense,
                    getVisibleCells: () => [],
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      {Object.keys(expenses).length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
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
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No expenses yet
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Start tracking your expenses by adding your first transaction.
          </p>
        </div>
      )}
    </div>
  );
}
