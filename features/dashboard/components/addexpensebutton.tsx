"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryGroupCombobox } from "./addexpenseselect";
import { Plus } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { addExpenseAction } from "../actions";
import { useBudgetStore } from "@/lib/store";
import toast from "react-hot-toast";
import { AccountSelect } from "./account-select";

export default function AddExpenseModalButton() {
  const { addActivity } = useBudgetStore((state) => state);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [categoryGroup, setCategoryGroup] = useState("");
  const [categoryChange, setCategoryChange] = useState<any>({});
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [account, setAccount] = useState("");
  const [type, setType] = useState("expense"); // New state for transaction type

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !type) {
      toast.error("Fill all details");
      return;
    }

    const result = await addExpenseAction({
      category,
      categoryGroup,
      amount: parseInt(amount),
      description,
      date:
        date?.toISOString().split("T")[0] ||
        new Date().toISOString().split("T")[0],
      categoryId: categoryChange.categoryID,
      accountID: account,
      type: type,
    });

    if (result.error) {
      toast.error(result.message);
      return;
    }

    if (type === "expense") {
      addActivity(categoryGroup, category, parseInt(amount));
    } else {
      addActivity(categoryGroup, category, -parseInt(amount));
    }

    // Reset form
    setDescription("");
    setAmount("");
    setCategory("");
    setDate(new Date());
    setType("expense"); // Reset to default

    toast.success(
      `${type === "expense" ? "Expense" : "Income"} added successfully!`,
    );
  };

  const isIncome = type === "income";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`mt-4 md:mt-0 ${
            isIncome
              ? "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
              : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          }`}
        >
          <Plus size={16} className="mr-2" />
          Add {isIncome ? "Income" : "Expense"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-gradient">
              Add New {isIncome ? "Income" : "Expense"}
            </DialogTitle>
            <DialogDescription>
              Track your {isIncome ? "earnings" : "spending"} by adding a new{" "}
              {isIncome ? "income" : "expense"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Transaction Type Selection */}
            <div className="grid gap-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">💸 Expense</SelectItem>
                  <SelectItem value="income">💰 Income</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder={
                  isIncome ? "Source of income?" : "What did you purchase?"
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/5"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/5"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <CategoryGroupCombobox
                selectedCategory={category}
                onChange={setCategoryChange}
                setCategoryGroup={setCategoryGroup}
                setSelectedCategory={setCategory}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="account">Account</Label>
              <AccountSelect selected={account} setSelected={setAccount} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <DatePicker date={date} setDate={setDate} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              className={
                isIncome
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-purple-600 hover:bg-purple-700"
              }
            >
              Add {isIncome ? "Income" : "Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
