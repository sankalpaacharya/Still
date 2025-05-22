"use client";
import { useState } from "react";
import {
  TotalAmountStatus,
  BudgetTable,
  TargetCard,
} from "@/features/finance/components";
import { Plus } from "lucide-react";

type Props = {};

export default function Page({}: Props) {
  const [availableAmount, setAvailableAmount] = useState(2889);

  const handleAssignAmount = () => {
    console.log("Assigning amount");
  };

  const handleAddCategory = (categoryId: string, name: string) => {
    console.log(`Adding category ${name} to ${categoryId}`);
  };

  const handleSaveTarget = (period: string, amount: number) => {
    console.log(`Saving ${period} target of ${amount}`);
  };

  const handleDeleteTarget = () => {
    console.log("Deleting target");
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
        <div className="flex flex-col w-full">
          <div className="mb-6">
            <span className="hover:bg-indigo-600/30 rounded-md p-2 px-3 flex space-x-2 items-center gap-1 w-fit transition-all duration-200 cursor-pointer">
              <Plus size={18} />
              add catgeory
            </span>
          </div>
          <BudgetTable onAddCategory={handleAddCategory} />
        </div>
        <TargetCard
          title="📺 Tv Streaming"
          onSaveTarget={handleSaveTarget}
          onDeleteTarget={handleDeleteTarget}
        />
      </div>
    </div>
  );
}
