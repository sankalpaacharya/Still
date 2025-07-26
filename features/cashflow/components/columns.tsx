"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type Expense = {
  id: string;
  category_id: string;
  account_id: string;
  created_at: string;
  amount: number;
  type: string;
  category: string;
  category_group: string;
  description: string;
  status?: string;
};

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "description",
    header: "Transaction",
    cell: ({ getValue, row }) => {
      const description = getValue() as string;
      const category = row.original.category;
      const categoryGroup = row.original.category_group;
      const date = new Date(row.original.created_at);
      const formatted = format(date, "MMM d");
      const year = format(date, "yyyy");
      const currentYear = new Date().getFullYear().toString();

      const getGroupColor = (group: string) => {
        const colors = {
          Food: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
          Transport:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
          Shopping:
            "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
          Entertainment:
            "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
          Bills: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
          Health:
            "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        };
        return (
          colors[group as keyof typeof colors] ||
          "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
        );
      };

      return (
        <div className="flex items-center space-x-3 py-1">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="w-5 h-5 bg-blue-500 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {description.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate mb-0.5">
              {description}
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getGroupColor(categoryGroup)} flex-shrink-0`}
              >
                {categoryGroup}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                •
              </span>
              <span className="text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                {formatted}
                {year !== currentYear && (
                  <span className="ml-1 text-zinc-400 dark:text-zinc-500">
                    {year}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue, row }) => {
      const amount = getValue() as number;
      const isExpense = row.original.type === "expense";
      const date = new Date(row.original.created_at);
      const formatted = format(date, "MMM d");
      const year = format(date, "yyyy");
      const currentYear = new Date().getFullYear().toString();

      return (
        <div className="text-right">
          <div
            className={`font-semibold text-sm ${
              isExpense
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {isExpense ? "-" : "+"}₹{" "}
            {Math.abs(amount).toLocaleString("en-NP", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 sm:hidden mt-0.5">
            {formatted}
            {year !== currentYear && (
              <span className="ml-1 text-zinc-400 dark:text-zinc-500">
                {year}
              </span>
            )}
          </div>
        </div>
      );
    },
  },
];
