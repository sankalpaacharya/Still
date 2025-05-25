"use client";

import { CategoryGroup } from "./CategoryGroup";
import { useBudgetStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";

type BudgetCategory = {
  id: string;
  title: string;
  icon?: React.ReactNode;
};

type BudgetTableProps = {
  categories?: BudgetCategory[];
  onAddCategory?: (categoryId: string, name: string) => void;
};

export function BudgetTable({ onAddCategory }: BudgetTableProps) {
  const displayCategories = useBudgetStore((state) => state.groups);

  return (
    <ScrollArea className="h-[45rem] px-4">
      <div className="space-y-3 mb-6 flex-1">
        {displayCategories.map((category) => (
          <CategoryGroup
            key={category.name}
            name={category.name}
            categories={category.categories}
            onAddCategory={(name) =>
              onAddCategory && onAddCategory(category.name, name)
            }
          />
        ))}
      </div>
    </ScrollArea>
  );
}
