"use client";

import { CategoryGroup } from "./CategoryGroup";

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
  // Default category if none provided
  const displayCategories = categories || [
    { id: "savings", title: "💰 Savings" },
  ];

  return (
    <div className="space-y-3 mb-6 flex-1">
      {displayCategories.map((category) => (
        <CategoryGroup
          key={category.id}
          title={category.title}
          icon={category.icon}
          onAddCategory={(name) => onAddCategory && onAddCategory(category.id, name)}
        />
      ))}
    </div>
  );
}
