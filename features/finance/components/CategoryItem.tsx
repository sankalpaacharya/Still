"use client";

import { Progress } from "@/components/ui/progress";
import { TableCell, TableRow } from "@/components/ui/table";

type CategoryItemProps = {
  name: string;
  assigned: number;
  spent: number;
  available: number;
  progressPercentage: number;
};

export function CategoryItem({
  name,
  assigned,
  spent,
  available,
  progressPercentage,
}: CategoryItemProps) {
  return (
    <TableRow className="text-md">
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
