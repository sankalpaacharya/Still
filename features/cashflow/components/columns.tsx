"use client";
import { ColumnDef } from "@tanstack/react-table";

export type Expense = {
  date: string;
  amount: number;
  category: string;
  description: string;
};

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => (
      <div className="text-red-400">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];
