"use client";
import React, { useState } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryGroupCombobox } from "@/features/dashboard/components/addexpenseselect";
import { AccountSelect } from "@/features/dashboard/components/account-select";
import { updateExpenseAction } from "../actions";
import toast from "react-hot-toast";

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

  return (
    <div className="space-y-1">
      <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
        <div className="col-span-2">Date</div>
        <div className="col-span-5">Description</div>
        <div className="col-span-3">Category</div>
        <div className="col-span-2 text-right">Amount</div>
      </div>

      {table.getRowModel().rows.length ? (
        <div className="space-y-2">
          {table.getRowModel().rows.map((row) => (
            <Sheet
              key={row.id}
              open={isSheetOpen}
              onOpenChange={setIsSheetOpen}
            >
              <SheetTrigger
                className="w-full"
                onClick={() => handleRowClick(row)}
              >
                <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200">
                  <div className="hidden lg:grid grid-cols-12 gap-4 items-center px-6 py-4">
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      let colSpan = "col-span-2";
                      if (cellIndex === 1) colSpan = "col-span-5";
                      if (cellIndex === 2) colSpan = "col-span-3";
                      if (cellIndex === 3) colSpan = "col-span-2";

                      return (
                        <div key={cell.id} className={colSpan}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Layout */}
                  <div className="lg:hidden px-4 py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                          {flexRender(
                            row.getVisibleCells()[1].column.columnDef.cell,
                            row.getVisibleCells()[1].getContext(),
                          )}
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          {flexRender(
                            row.getVisibleCells()[2].column.columnDef.cell,
                            row.getVisibleCells()[2].getContext(),
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {flexRender(
                            row.getVisibleCells()[3].column.columnDef.cell,
                            row.getVisibleCells()[3].getContext(),
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          {flexRender(
                            row.getVisibleCells()[0].column.columnDef.cell,
                            row.getVisibleCells()[0].getContext(),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* sheet here */}
              </SheetTrigger>
              <SheetContent className="md:w-3/4 w-full px-5">
                <SheetHeader>
                  <SheetTitle>Edit Expense</SheetTitle>
                  <SheetDescription>
                    Update your expense details below.
                  </SheetDescription>
                </SheetHeader>

                {editingExpense && (
                  <form onSubmit={handleSaveExpense} className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={editingExpense.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Enter expense description"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <CategoryGroupCombobox
                        onChange={() => {}}
                        selectedCategory={""}
                        setCategoryGroup={setCategory}
                        setSelectedCategory={setCategoryGroup}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={editingExpense.amount}
                        onChange={(e) =>
                          handleInputChange("amount", e.target.value)
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Account</Label>
                      <AccountSelect
                        selected={account}
                        setSelected={setAccount}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={editingExpense.date}
                        onChange={(e) =>
                          handleInputChange("date", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsSheetOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </SheetContent>
            </Sheet>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            No expenses found
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400">
            Start by adding your first expense to see it here.
          </p>
        </div>
      )}
    </div>
  );
}
