"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
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
import { Edit3 } from "lucide-react";
import { getTransactionsByDate, updateTransactionAction } from "../actions";
import { CategoryGroupCombobox } from "./addexpenseselect";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  icon: string;
  type: string;
  category_id: string;
  account_id?: string;
  created_at: string;
};

type HeatMapProps = {
  children: React.ReactNode;
  date: string;
  amount: number;
};

export default function HeatMapSheet({ children, date, amount }: HeatMapProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
  });
  const [categoryChange, setCategoryChange] = useState<any>({});
  const router = useRouter();

  const actualDate = new Date(date);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      console.log("Loading transactions for date:", date);
      const data = await getTransactionsByDate(date);
      console.log("Transactions loaded:", data);
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);

    const dateOnly = transaction.date.includes("T")
      ? transaction.date.split("T")[0]
      : transaction.date.split(" ")[0];

    setEditForm({
      description: transaction.description,
      amount: transaction.amount.toString(),
      date: dateOnly,
      category: transaction.category,
    });
    setCategoryChange({
      categoryID: transaction.category_id,
      categoryName: transaction.category,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingTransaction) return;

    try {
      const dateToSave = editForm.date.includes("T")
        ? editForm.date
        : `${editForm.date}T00:00:00.000+00`;

      const result = await updateTransactionAction({
        id: editingTransaction.id,
        description: editForm.description,
        amount: parseFloat(editForm.amount),
        date: dateToSave,
        categoryID: categoryChange.categoryID || editingTransaction.category_id,
        category: categoryChange.categoryName || editingTransaction.category,
      });

      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success("Transaction updated successfully");
        setEditingTransaction(null);
        await loadTransactions();

        setTimeout(() => {
          router.refresh();
        }, 500);
      }
    } catch (error) {
      toast.error("Failed to update transaction");
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${Math.abs(amount).toLocaleString("en-IN")}`;
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild onClick={loadTransactions}>
          {children}
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg px-5 py-6 h-screen overflow-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <span>Transactions for {format(actualDate, "MMMM d, yyyy")}</span>
            </SheetTitle>
            <SheetDescription>
              {amount > 0 ? (
                <span className="text-blue-600 font-medium">
                  Total spending: {formatCurrency(amount)}
                </span>
              ) : (
                <span className="text-muted-foreground">
                  No transactions on this day
                </span>
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No transactions found for this day</p>
              </div>
            ) : (
              transactions.map((transaction) => {
                const isEditing = editingTransaction?.id === transaction.id;
                const isExpense = transaction.type === "expense";

                return (
                  <Card key={transaction.id} className="relative">
                    <CardContent className="p-4">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                              id="description"
                              value={editForm.description}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Enter description"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="amount">Amount (₹)</Label>
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              value={editForm.amount}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  amount: e.target.value,
                                })
                              }
                              placeholder="0.00"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <CategoryGroupCombobox
                              onChange={setCategoryChange}
                              selectedCategory={categoryChange.categoryName}
                              setCategoryGroup={() => {}}
                              setSelectedCategory={() => {}}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={editForm.date}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  date: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button onClick={handleSaveEdit} className="flex-1">
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingTransaction(null)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-2xl">{transaction.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {transaction.description}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="secondary" className="text-xs">
                                  {transaction.category}
                                </Badge>
                                <span>•</span>
                                <span>
                                  {format(
                                    new Date(transaction.created_at),
                                    "h:mm a",
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div
                              className={`font-semibold text-sm ${
                                isExpense
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-green-600 dark:text-green-400"
                              }`}
                            >
                              {isExpense ? "-" : "+"}
                              {formatCurrency(transaction.amount)}
                            </div>

                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(transaction)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
