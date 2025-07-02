"use client";
import React, { useState } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { updateExpenseAction } from "../actions";
import toast from "react-hot-toast";
import { ExpenseRow } from "./transactions-row";
import { EditExpenseSheet } from "./edit-transaction-sheet";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onUpdateExpense?: (updatedExpense: any) => void;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  onUpdateExpense,
}: DataTableProps<TData, TValue>) {
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryGroup, setCategoryGroup] = useState("");
  const [account, setAccount] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (row: any) => {
    const cells = row.getVisibleCells();
    const expenseData = {
      id: row.original["id"],
      date: cells[0]?.getValue() || "",
      description: cells[1]?.getValue() || "",
      category: cells[2]?.getValue() || "",
      amount: cells[3]?.getValue() || "",
      categoryID: row.original["category_id"],
    };
    setEditingExpense(expenseData);
    setAccount(row.original["account_id"]);
    setIsSheetOpen(true);
    setCategory(category);
  };

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateExpense && editingExpense) {
      onUpdateExpense(editingExpense);
    }
    const result = await updateExpenseAction({
      ...editingExpense,
      accountID: account,
    });
    if (result.error) {
      toast.error(result.message);
    }
    setIsSheetOpen(false);
    setEditingExpense(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditingExpense((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!table.getRowModel().rows.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-20 h-20 mb-6 bg-muted/50 rounded-2xl flex items-center justify-center">
          <svg
            className="w-10 h-10 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          Your recent transactions will appear here once you start adding them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {table.getRowModel().rows.map((row) => (
        <Sheet key={row.id} open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <div onClick={() => handleRowClick(row)}>
              <ExpenseRow row={row} />
            </div>
          </SheetTrigger>
          <EditExpenseSheet
            editingExpense={editingExpense}
            account={account}
            setAccount={setAccount}
            category={category}
            setCategory={setCategory}
            categoryGroup={categoryGroup}
            setCategoryGroup={setCategoryGroup}
            onSave={handleSaveExpense}
            onInputChange={handleInputChange}
            onCancel={() => setIsSheetOpen(false)}
          />
        </Sheet>
      ))}
    </div>
  );
}
