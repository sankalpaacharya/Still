"use client";
import { useEffect, useState } from "react";
import {
  TotalAmountStatus,
  BudgetTable,
  TargetCard,
} from "@/features/finance/components";

import { useBudgetStore } from "@/lib/store";
import toast from "react-hot-toast";
import { hydrateBugetStore } from "@/lib/zustand-sync";

export default function Page() {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const hydarate = async () => {
      await hydrateBugetStore();
    };
    hydarate();
  }, []);

  const { groups, selectedCategory, selectedGroup } = useBudgetStore(
    (state) => state
  );

  const { addCategoryGroup, totalAmount } = useBudgetStore((state) => state);

  const handleAssignAmount = () => {
    console.log("Assigning amount");
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      if (
        groups.some(
          (categoryGroup) => categoryGroup.name === newCategoryName.trim()
        )
      ) {
        toast.error("name already exists");
        return;
      }
      addCategoryGroup(newCategoryName.trim());
      console.log(`Created new category: ${newCategoryName.trim()}`);

      setNewCategoryName("");
      setIsPopoverOpen(false);
    }
  };

  const handleCancelCategory = () => {
    setNewCategoryName("");
    setIsPopoverOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateCategory();
    } else if (e.key === "Escape") {
      handleCancelCategory();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex w-[65%] justify-center">
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
