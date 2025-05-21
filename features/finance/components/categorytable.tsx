"use client";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { CategoryItem } from "./CategoryItem";

type Category = {
  id: string;
  name: string;
  assigned: number;
  spent: number;
  available: number;
  progressPercentage: number;
};

type CategoryTableProps = {
  categories?: Category[];
};

export function CategoryTable({ categories = [] }: CategoryTableProps) {
  // If no categories are provided, use demo data
  const displayCategories = categories.length > 0 
    ? categories 
    : [
        {
          id: '1',
          name: 'Tv, Transportation',
          assigned: 500,
          spent: 500,
          available: 1000,
          progressPercentage: 33,
        },
        {
          id: '2',
          name: 'Groceries',
          assigned: 500,
          spent: 500,
          available: 1000,
          progressPercentage: 33,
        },
        {
          id: '3',
          name: 'Entertainment',
          assigned: 500,
          spent: 500,
          available: 1000,
          progressPercentage: 33,
        },
      ];

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
        {displayCategories.map((category) => (
          <CategoryItem
            key={category.id}
            name={category.name}
            assigned={category.assigned}
            spent={category.spent}
            available={category.available}
            progressPercentage={category.progressPercentage}
          />
        ))}
      </TableBody>
    </Table>
  );
}
