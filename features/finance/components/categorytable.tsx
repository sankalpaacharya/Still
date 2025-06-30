"use client";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { CategoryItem } from "./CategoryItem";
import { Category } from "@/lib/store";

type CategoryTableProps = {
  categories?: Category[];
  groupName?: string;
};

export function CategoryTable({
  categories = [],
  groupName = "",
}: CategoryTableProps) {
  const displayCategories = categories.length > 0 ? categories : [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[61%] font-bold text-gray-400 px-5">
            Category
          </TableHead>
          <TableHead className="w-[13%] font-bold text-gray-400 text-right px-5">
            Assigned
          </TableHead>
          <TableHead className="w-[13%] font-bold text-gray-400 text-right px-5">
            Spent
          </TableHead>
          <TableHead className="w-[13%] font-bold text-gray-400 text-right px-5">
            Available
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayCategories.map((category: Category) => (
          <CategoryItem
            id={category.id || ""}
            key={category.id}
            name={category.name}
            assigned={category.assign}
            spent={category.activity}
            available={category.assign - category.activity}
            target={category.target}
            groupName={groupName}
          />
        ))}
      </TableBody>
    </Table>
  );
}
