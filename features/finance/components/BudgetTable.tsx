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
};

export function BudgetTable({}: BudgetTableProps) {
  const displayCategories = useBudgetStore((state) => state.groups);

  return (
    <ScrollArea className="h-[45rem] px-4">
      <div className="space-y-3 mb-6 flex-1">
        {displayCategories.map((category) => (
          <CategoryGroup
            key={category.name}
            name={category.name}
            categories={category.categories}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
