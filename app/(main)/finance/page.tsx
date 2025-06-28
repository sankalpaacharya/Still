"use client";
import {
  BudgetTable,
  TargetCard,
  BalanceCard,
} from "@/features/finance/components";
import { useBudgetStore } from "@/lib/store";
import { MonthSelector } from "@/features/finance/components/months-selector";

export default function Page() {
  const { selectedCategory, selectedGroup } = useBudgetStore((state) => state);

  return (
    <div className="space-y-6 h-full">
      <div className="flex gap-40">
        <MonthSelector />
        <BalanceCard />
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col w-full">
          <BudgetTable />
        </div>
        <TargetCard
          title={
            selectedCategory
              ? `${selectedCategory} (${selectedGroup})`
              : "Select a category"
          }
        />
      </div>
    </div>
  );
}
