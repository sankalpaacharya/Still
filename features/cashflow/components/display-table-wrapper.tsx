// app/features/cashflow/components/expense-group.tsx
"use client";

import React from "react";
import { columns } from "./columns";
import DataTable from "./data-table";

interface ExpenseGroupProps {
  name: string;
  expenses: any[];
}

export default function ExpenseGroup({ name, expenses }: ExpenseGroupProps) {
  const total = expenses.reduce((sum, exp) => sum + Math.abs(exp.amount), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {name}
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
          </span>
        </div>

        <div className="text-right">
          <div className="font-semibold text-sm text-zinc-500 dark:text-zinc-400">
            ₹{" "}
            {total.toLocaleString("en-NP", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      <div className="bg-white w-full dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
        <div className="p-6">
          <DataTable columns={columns} data={expenses} />
        </div>
      </div>
    </div>
  );
}
