"use client";
import { useEffect } from "react";
import {
  TotalAmountStatus,
  BudgetTable,
  TargetCard,
} from "@/features/finance/components";
import { useBudgetStore } from "@/lib/store";
import { hydrateBugetStore } from "@/lib/zustand-sync";
import { MonthSelector } from "@/features/finance/components/months-selector";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";

export default function Page() {
  useEffect(() => {
    const hydarate = async () => {
      await hydrateBugetStore();
    };
    hydarate();
  }, []);

  const { selectedCategory, selectedGroup } = useBudgetStore((state) => state);

  const { totalAmount } = useBudgetStore((state) => state);

  const handleAssignAmount = () => {
    console.log("Assigning amount");
  };

  return (
    <div className="space-y-6 h-full">
      <StarsBackground starDensity={0.000016} />
      <ShootingStars />
      <div className="flex gap-40">
        <MonthSelector />
        <TotalAmountStatus amount={totalAmount} onAssign={handleAssignAmount} />
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
