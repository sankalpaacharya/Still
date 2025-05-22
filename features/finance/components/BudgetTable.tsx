"use client";

import { CategoryGroup } from "./CategoryGroup";
import { useBudgetStore } from "@/lib/store";

type BudgetCategory = {
  id: string;
  title: string;
  icon?: React.ReactNode;
};

type BudgetTableProps = {
  categories?: BudgetCategory[];
  onAddCategory?: (categoryId: string, name: string) => void;
};

export function BudgetTable({ categories, onAddCategory }: BudgetTableProps) {
  const displayCategories = useBudgetStore((state) => state.groups);

  return (
    <div className="space-y-3 mb-6 flex-1">
      {displayCategories.map((category) => (
        <CategoryGroup
          key={category.name}
          name={category.name}
          onAddCategory={(name) =>
            onAddCategory && onAddCategory(category.name, name)
          }
        />
      ))}
    </div>
  );
}
