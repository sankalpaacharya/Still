"use client";
import { CategoryGroup } from "./CategoryGroup";
import { useBudgetStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

type BudgetCategory = {
  id: string;
  title: string;
  icon?: React.ReactNode;
};

type BudgetTableProps = {
  categories?: BudgetCategory[];
};

export function BudgetTable({}: BudgetTableProps) {
  const { groups, addCategoryGroup } = useBudgetStore((state) => state);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

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
    <ScrollArea className="h-[45rem] px-4">
      <div className="space-y-3 mb-5 flex-1">
        {groups.map((category) => (
          <CategoryGroup
            key={category.name}
            name={category.name}
            categories={category.categories}
          />
        ))}
      </div>
      <div className="pt-2">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 w-full p-5">
              <Plus size={16} />
              Add Category
            </Button>
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
    </ScrollArea>
  );
}
