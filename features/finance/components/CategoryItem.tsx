"use client";

import { Progress } from "@/components/ui/progress";
import { TableCell, TableRow } from "@/components/ui/table";
import { useBudgetStore } from "@/lib/store";

type CategoryItemProps = {
  name: string;
  assigned: number;
  spent: number;
  available: number;
  progressPercentage: number;
  groupName?: string;
};

export function CategoryItem({
  name,
  assigned,
  spent,
  available,
  progressPercentage,
  groupName = "",
}: CategoryItemProps) {
  const setSelectedCategory = useBudgetStore(
    (state) => state.setSelectedCategory
  );
  const selectedCategory = useBudgetStore((state) => state.selectedCategory);
  const selectedGroup = useBudgetStore((state) => state.selectedGroup);

  const isSelected = selectedCategory === name && selectedGroup === groupName;

  const handleClick = () => {
    setSelectedCategory(name, groupName);
  };

  return (
    <TableRow
      className={`text-md hover:bg-gray-100/10 cursor-pointer transition-colors`}
      onClick={handleClick}
    >
      <TableCell className="w-[61%] p-5">
        {name}
        <Progress value={progressPercentage} className="mt-2 h-1" />
      </TableCell>
      <TableCell className="w-[13%] text-right p-5">₹{assigned}</TableCell>
      <TableCell className="w-[13%] text-right p-5">₹{spent}</TableCell>
      <TableCell className="w-[13%] text-right p-5">₹{available}</TableCell>
    </TableRow>
  );
}
