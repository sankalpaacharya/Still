import React from "react";
import { getCategoryEmoji } from "@/lib/utils";

interface ExpenseRowProps {
  row: any;
}

export const ExpenseRow: React.FC<ExpenseRowProps> = ({ row }) => {
  const cells = row.getVisibleCells();
  const amount = row.original.amount;
  const isExpense = row.original.type === "expense";
  const categoryGroup = row.original.category;
  const description = row.original.description;
  const date = new Date(row.original.created_at);
  const icon = row.original.icon;
  const imageUrl = row.original.imageUrl;
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors duration-150 border-b border-border/50 last:border-b-0">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={description}
              className="w-8 h-8 rounded-lg object-cover border border-border/50"
            />
          ) : (
            <span className="text-sm transition-transform duration-200 group-hover:scale-110">
              {icon}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate mb-0.5">
            {description}
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span className="bg-muted px-2 py-0.5 rounded-full">
              {categoryGroup}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end space-y1.5 flex-shrink-0">
        <div
          className={`font-semibold text-sm ${
            isExpense
              ? "text-destructive"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {isExpense ? "-" : "+"}₹{" "}
          {Math.abs(amount).toLocaleString("en-NP", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </div>
        <div className="text-xs text-muted-foreground sm:hidden">
          {formattedDate}
        </div>
      </div>
    </div>
  );
};
