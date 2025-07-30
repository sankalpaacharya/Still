"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Check, X, Package } from "lucide-react";

type Transaction = {
  id: string;
  amount: number;
  date: string;
  description: string;
  category_id: { name: string };
};

type TransactionSheetProps = {
  children: React.ReactNode;
  transactions?: Transaction | Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
};

export default function TransactionSheet({
  children,
  transactions,
  onEdit,
  onDelete,
}: TransactionSheetProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Transaction | null>(null);

  const transactionArray = Array.isArray(transactions)
    ? transactions
    : transactions
      ? [transactions]
      : [];

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditData({ ...transaction });
  };

  const handleSave = () => {
    if (editData && onEdit) {
      onEdit(editData);
    }
    setEditingId(null);
    setEditData(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  if (transactionArray.length === 0) {
    return (
      <Sheet>
        <SheetTrigger>{children}</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Transactions</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Package className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500">No transactions found</p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="w-[500px] p-2">
        <SheetHeader>
          <SheetTitle>Transactions ({transactionArray.length})</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          <div className="space-y-2">
            {transactionArray.map((transaction) => (
              <div
                key={transaction.id}
                className="border rounded-lg p-3 hover:bg-gray-50"
              >
                {editingId === transaction.id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={editData?.amount || 0}
                        onChange={(e) =>
                          setEditData((prev) =>
                            prev
                              ? { ...prev, amount: parseFloat(e.target.value) }
                              : null,
                          )
                        }
                        placeholder="Amount"
                        className="h-8"
                      />
                      <Input
                        value={editData?.category_id.name || ""}
                        onChange={(e) =>
                          setEditData((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  category_id: { name: e.target.value },
                                }
                              : null,
                          )
                        }
                        placeholder="Category"
                        className="h-8"
                      />
                    </div>
                    <Input
                      value={editData?.description || ""}
                      onChange={(e) =>
                        setEditData((prev) =>
                          prev
                            ? { ...prev, description: e.target.value }
                            : null,
                        )
                      }
                      placeholder="Description"
                      className="h-8"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="h-7 px-3"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        className="h-7 px-3"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-red-500">
                          {formatAmount(transaction.amount)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category_id.name}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {transaction.description}
                      </p>
                    </div>

                    <div className="flex gap-1 ml-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(transaction)}
                        className="h-7 w-7 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Transaction
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete?.(transaction.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
