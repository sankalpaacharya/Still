import React from "react";
import { flexRender } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExpenseRowProps {
  row: any;
}

const getCategoryIcon = (category: string) => {
  const icons = {
    Food: "🍽️",
    Transport: "🚗",
    Shopping: "🛍️",
    Entertainment: "🎬",
    Bills: "⚡",
    Health: "🏥",
    Utilities: "⚡",
  };
  return icons[category as keyof typeof icons] || "💳";
};

export const ExpenseRow: React.FC<ExpenseRowProps> = ({ row }) => {
  const cells = row.getVisibleCells();
  const amount = row.original.amount;
  const isExpense = row.original.type == "expense";
  const categoryGroup = row.original.categoryGroup;
  const description = row.original.description;

  return (
    <Card className="group cursor-pointer hover:shadow-md transition-all duration-200">
      <CardContent className="px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-lg">{getCategoryIcon(categoryGroup)}</span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate mb-1">{description}</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {categoryGroup}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {flexRender(
                    cells[0].column.columnDef.cell,
                    cells[0].getContext(),
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="text-right">
              <div
                className={`font-semibold text-lg ${
                  isExpense
                    ? "text-destructive"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {isExpense ? "-" : "+"}NPR{" "}
                {Math.abs(amount).toLocaleString("en-NP", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-xs text-muted-foreground">
                {isExpense ? "Expense" : "Income"}
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
