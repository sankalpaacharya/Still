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
import { Edit3, ChevronLeft, ChevronRight } from "lucide-react";
import { getTransactionsByDate, updateTransactionAction } from "../actions";
import { CategoryGroupCombobox } from "./addexpenseselect";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { getAllCategories } from "@/features/categories/actions";
import { motion, AnimatePresence } from "framer-motion";
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
type HeatMapProps = { children: React.ReactNode; date: string; amount: number };
export default function HeatMapSheet({ children, date, amount }: HeatMapProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [editStep, setEditStep] = useState(1);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [editForm, setEditForm] = useState({
    description: "",
    amount: "",
    date: new Date(),
    category: "",
  });
  const [categoryChange, setCategoryChange] = useState<any>({});
  const router = useRouter();
  const actualDate = new Date(date);
  const totalSteps = 3;
  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await getAllCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);
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
    setEditStep(1);
    setEditForm({
      description: transaction.description,
      amount: transaction.amount.toString(),
      date: new Date(transaction.date),
      category: transaction.category,
    });
    setCategoryChange({
      categoryID: transaction.category_id,
      categoryName: transaction.category,
    });
  };
  const validateCurrentStep = () => {
    switch (editStep) {
      case 1:
        return editForm.amount && editForm.amount.length > 0;
      case 2:
        return editForm.description && editForm.description.length > 0;
      case 3:
        return (
          categoryChange.categoryID && categoryChange.categoryID.length > 0
        );
      default:
        return false;
    }
  };
  const handleNext = async () => {
    if (editStep < totalSteps) {
      if (validateCurrentStep()) {
        setEditStep((prev) => prev + 1);
      }
    } else {
      await handleSaveEdit();
    }
  };
  const handleBack = () => {
    if (editStep > 1) setEditStep((prev) => prev - 1);
  };
  const handleSaveEdit = async () => {
    if (!editingTransaction) return;
    try {
      setButtonDisabled(true);
      const dateToSave =
        editForm.date instanceof Date
          ? editForm.date.toISOString().split("T")[0] + "T00:00:00.000+00"
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
        setEditStep(1);
        await loadTransactions();
        setTimeout(() => {
          router.refresh();
        }, 500);
      }
    } catch (error) {
      toast.error("Failed to update transaction");
    } finally {
      setButtonDisabled(false);
    }
  };
  const renderEditStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center space-y-4">
            {" "}
            <div className="flex items-center space-x-3">
              {" "}
              <span className="text-4xl font-bold text-white">₹</span>{" "}
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                maxLength={8}
                value={editForm.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    setEditForm({ ...editForm, amount: value });
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    editForm.amount &&
                    editForm.amount.length > 0
                  ) {
                    handleNext();
                  }
                }}
                style={{
                  fontSize: "3rem",
                  height: "auto",
                  backgroundColor: "transparent",
                }}
                autoFocus
                className="bg-transparent w-[200px] text-4xl font-bold text-white text-center border-none focus:outline-none focus:ring-0 placeholder:text-white/30"
              />{" "}
            </div>{" "}
          </div>
        );
      case 2:
        return (
          <div className="w-full max-w-md space-y-6">
            {" "}
            <div className="space-y-3">
              {" "}
              <Label className="text-white text-lg font-medium">
                Description
              </Label>{" "}
              <Input
                autoFocus
                placeholder="e.g. Coffee at Starbucks"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    editForm.description &&
                    editForm.description.length > 0
                  ) {
                    handleNext();
                  }
                }}
                className="bg-white/5 border-white/10 text-white placeholder-white/40 rounded-md py-3 transition-all duration-200 focus:ring-2 focus:ring-white/30 focus:border-white/30"
              />{" "}
              <p className="text-sm text-white/50">
                {" "}
                Add a short note about your expense (max 50 characters).{" "}
              </p>{" "}
            </div>{" "}
            <div className="space-y-3">
              {" "}
              <Label className="text-white text-lg font-medium">
                Date
              </Label>{" "}
              <Input
                type="date"
                value={
                  editForm.date instanceof Date
                    ? editForm.date.toISOString().split("T")[0]
                    : editForm.date
                }
                onChange={(e) =>
                  setEditForm({ ...editForm, date: new Date(e.target.value) })
                }
                className="bg-white/5 border-white/10 text-white placeholder-white/40 rounded-md py-3 transition-all duration-200 focus:ring-2 focus:ring-white/30 focus:border-white/30"
              />{" "}
              <p className="text-sm text-white/50">Date of your expense</p>{" "}
            </div>{" "}
          </div>
        );
      case 3:
        return (
          <div className="w-full max-w-md space-y-3">
            {" "}
            <Label className="text-white text-lg font-medium">
              Category
            </Label>{" "}
            <div className="grid grid-cols-2 gap-3">
              {" "}
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={
                    categoryChange.categoryID === cat.id
                      ? "default"
                      : "secondary"
                  }
                  onClick={() =>
                    setCategoryChange({
                      categoryID: cat.id,
                      categoryName: cat.name,
                    })
                  }
                  className={`py-6 transition-all duration-200 ${categoryChange.categoryID === cat.id ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/20"}`}
                >
                  {cat.icon} {cat.name}
                </Button>
              ))}
            </div>
            <p className="text-sm text-white/50">
              Select a category for this expense
            </p>
          </div>
        );
      default:
        return null;
    }
  };
  const formatCurrency = (amount: number) => {
    return `₹${Math.abs(amount).toLocaleString("en-IN")}`;
  };
  return (
    <Sheet>
      <SheetTrigger asChild onClick={loadTransactions}>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg px-5 h-screen overflow-auto">
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
        <div className="mt-1 space-y-0.5">
          {loading ? (
            <div className="flex items-center justify-center py-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-3 text-muted-foreground">
              <p className="text-sm">No transactions found for this day</p>
            </div>
          ) : (
            transactions.map((transaction) => {
              const isEditing = editingTransaction?.id === transaction.id;
              const isExpense = transaction.type === "expense";
              return (
                <div
                  key={transaction.id}
                  className="relative border-0 shadow-none bg-muted/20 rounded-md"
                >
                  <div className="">
                    {isEditing ? (
                      <div className="bg-gradient-to-br p-6 rounded-lg">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <ChevronLeft
                              onClick={handleBack}
                              className={`${editStep === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} text-white w-6 h-6`}
                            />
                            <h1 className="text-white text-xl font-semibold">
                              Edit Transaction
                            </h1>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalSteps }, (_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${i + 1 <= editStep ? "bg-white" : "bg-white/30"} transition-colors duration-200`}
                              />
                            ))}
                          </div>
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={editStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex-grow flex items-center justify-center min-h-[200px]"
                          >
                            {renderEditStep(editStep)}
                          </motion.div>
                        </AnimatePresence>
                        <div className="pt-6 flex gap-3">
                          {editStep > 1 && (
                            <Button
                              onClick={handleBack}
                              variant="outline"
                              className="w-1/2 border-white/20 text-white hover:bg-white/10"
                            >
                              Back
                            </Button>
                          )}
                          <Button
                            disabled={isButtonDisabled}
                            onClick={handleNext}
                            className="w-full text-white font-medium bg-white/20 hover:bg-white/30"
                            variant="secondary"
                          >
                            {editStep === totalSteps ? (
                              "Update Transaction"
                            ) : (
                              <>
                                Next
                                <ChevronRight className="ml-2 w-4 h-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2">
                        {" "}
                        <div className="flex items-center gap-1.5 flex-1">
                          {" "}
                          <div className="text-lg">{transaction.icon}</div>{" "}
                          <div className="flex-1 min-w-0">
                            {" "}
                            <div className="font-medium text-xs truncate">
                              {" "}
                              {transaction.description}{" "}
                            </div>{" "}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              {" "}
                              <Badge
                                variant="secondary"
                                className="text-xs py-0 px-1.5 h-4"
                              >
                                {" "}
                                {transaction.category}{" "}
                              </Badge>{" "}
                              <span>•</span>{" "}
                              <span>
                                {" "}
                                {format(
                                  new Date(transaction.created_at),
                                  "h:mm a",
                                )}{" "}
                              </span>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>{" "}
                        <div className="flex items-center gap-0.5">
                          {" "}
                          <div
                            className={`font-semibold text-xs ${isExpense ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                          >
                            {" "}
                            {isExpense ? "-" : "+"}{" "}
                            {formatCurrency(transaction.amount)}{" "}
                          </div>{" "}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(transaction)}
                            className="h-6 w-6 p-0 ml-1"
                          >
                            {" "}
                            <Edit3 className="h-3 w-3" />{" "}
                          </Button>{" "}
                        </div>{" "}
                      </div>
                    )}{" "}
                  </div>{" "}
                </div>
              );
            })
          )}{" "}
        </div>{" "}
      </SheetContent>{" "}
    </Sheet>
  );
}
