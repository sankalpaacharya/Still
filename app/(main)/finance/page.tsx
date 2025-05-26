"use client";
import { useState } from "react";
import {
  TotalAmountStatus,
  BudgetTable,
  TargetCard,
} from "@/features/finance/components";
import { Plus } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBudgetStore } from "@/lib/store";
import toast from "react-hot-toast";

type Props = {};

export default function Page({}: Props) {
  const [availableAmount, setAvailableAmount] = useState(2889);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { groups, selectedCategory, selectedGroup } = useBudgetStore(
    (state) => state
  );

  const { addCategoryGroup } = useBudgetStore((state) => state);

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
        <TotalAmountStatus
          amount={availableAmount}
          onAssign={handleAssignAmount}
        />
      </div>

      <div className="flex gap-6">
        <div className="flex flex-col w-full space-y-6">
          <div>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <button className="hover:bg-indigo-600/30 rounded-md p-2 px-3 flex items-center gap-2 w-fit transition-all duration-200 cursor-pointer">
                  <Plus size={18} />
                  <span>Add Category</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="category-name"
                      className="block text-sm font-medium mb-2"
                    >
                      Category Name
                    </label>
                    <Input
                      id="category-name"
                      type="text"
                      placeholder="Enter category name..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={handleKeyPress}
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="secondary"
                      onClick={handleCancelCategory}
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateCategory}
                      disabled={!newCategoryName.trim()}
                      size="sm"
                    >
                      Add Category
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

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
