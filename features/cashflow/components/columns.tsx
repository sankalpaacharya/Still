"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type Expense = {
  created_at: string;
  amount: number;
  category: string;
  categoryGroup: string;
  description: string;
  status?: string;
};

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      const formatted = format(date, "MMM d");
      const year = format(date, "yyyy");
      const currentYear = new Date().getFullYear().toString();

      return (
        <div className="flex flex-col">
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {formatted}
          </span>
          {year !== currentYear && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {year}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue, row }) => {
      const description = getValue() as string;
      const merchant = description;

      return (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {merchant.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {description}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {row.original.status && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  {row.original.status}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      const group = row.original.categoryGroup;

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
        <div className="flex flex-col space-y-1">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGroupColor(
              group
            )} w-fit`}
          >
            {group}
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {category}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => {
      const amount = getValue() as number;
      const isNegative = amount < 0;

      return (
        <div className="text-right">
          <div
            className={`font-semibold text-lg ${
              isNegative
                ? "text-red-600 dark:text-red-400"
                : "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            NPR{" "}
            {Math.abs(amount).toLocaleString("en-NP", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          {isNegative && (
            <div className="text-xs text-red-500 dark:text-red-400">
              Expense
            </div>
          )}
        </div>
      );
    },
  },
];
