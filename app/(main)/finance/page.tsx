"use client";
import { useState } from "react";
import {
  TotalAmountStatus,
  BudgetTable,
  TargetCard,
} from "@/features/finance/components";

type Props = {};

export default function Page({}: Props) {
  // These state functions would connect to your state management solution later
  const [availableAmount, setAvailableAmount] = useState(2889);

  const handleAssignAmount = () => {
    console.log("Assigning amount");
    // This would be implemented with your state management solution
  };

  const handleAddCategory = (categoryId: string, name: string) => {
    console.log(`Adding category ${name} to ${categoryId}`);
    // This would be implemented with your state management solution
  };

  const handleSaveTarget = (period: string, amount: number) => {
    console.log(`Saving ${period} target of ${amount}`);
    // This would be implemented with your state management solution
  };

  const handleDeleteTarget = () => {
    console.log("Deleting target");
    // This would be implemented with your state management solution
  };

  return (
    <div>
      <div className="flex w-[65%] justify-center">
        <TotalAmountStatus
          amount={availableAmount}
          onAssign={handleAssignAmount}
        />
      </div>
      <div className="flex gap-2">
        <BudgetTable onAddCategory={handleAddCategory} />
        <TargetCard
          title="📺 Tv Streaming"
          onSaveTarget={handleSaveTarget}
          onDeleteTarget={handleDeleteTarget}
        />
      </div>
    </div>
  );
}
