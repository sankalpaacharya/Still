"use client";
import React, { useState } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
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
  groupName?: string; // Add group name for the header
}

// Individual row component to manage its own sheet state
const ExpenseRowWithSheet: React.FC<{
  row: any;
  onUpdateExpense?: (updatedExpense: any) => void;
}> = ({ row, onUpdateExpense }) => {
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryGroup, setCategoryGroup] = useState("");
  const [account, setAccount] = useState("");

  const handleRowClick = () => {
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
    setCategory(row.original["category"] || "");
    setCategoryGroup(row.original["category"] || "");
    setIsSheetOpen(true);
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
    } else {
      toast.success("Transaction updated successfully");
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

  const handleDelete = async () => {
    // Add your delete logic here
    console.log("Delete expense:", editingExpense?.id);
    setIsSheetOpen(false);
    setEditingExpense(null);
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <div onClick={handleRowClick}>
          <ExpenseRow row={row} />
        </div>
      </SheetTrigger>
      <EditExpenseSheet
        editingExpense={editingExpense}
        onDelete={handleDelete}
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
  );
};

export default function DataTable<TData, TValue>({
  columns,
  data,
  onUpdateExpense,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header - Only visible on larger screens */}
      <div className="hidden md:flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <div className="flex-1">Transaction</div>
        <div className="w-24 text-right">Amount</div>
      </div>
      <div className="divide-y divide-border">
        {table.getRowModel().rows.map((row) => (
          <ExpenseRowWithSheet
            key={row.id}
            row={row}
            onUpdateExpense={onUpdateExpense}
          />
        ))}
      </div>
    </div>
  );
}
