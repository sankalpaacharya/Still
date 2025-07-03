"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { addExpenseAction } from "../actions";
import { useBudgetStore } from "@/lib/store";
import toast from "react-hot-toast";
import { AccountSelect } from "./account-select";
import { CategoryGroupCombobox } from "./addexpenseselect";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export default function NewAddExpenseModalButton() {
  const { addActivity } = useBudgetStore((state) => state);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState<"income" | "expense" | "">("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [categoryGroup, setCategoryGroup] = useState("");
  const [categoryChange, setCategoryChange] = useState<any>({});
  const [account, setAccount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setType("");
    setAmount("");
    setCategory("");
    setCategoryGroup("");
    setCategoryChange({});
    setAccount("");
    setDate(new Date().toISOString().split("T")[0]);
    setDescription("");
  };

  const handleSubmit = async () => {
    if (!description || !amount || !category || !type || !account) {
      toast.error("Please fill out all fields");
      return;
    }

    setLoading(true);
    const result = await addExpenseAction({
      category,
      categoryGroup,
      amount: parseInt(amount),
      description,
      date,
      categoryId: categoryChange.categoryID,
      accountID: account,
      type,
    });
    setLoading(false);

    if (result.error) {
      toast.error(result.message);
      return;
    }

    addActivity(
      categoryGroup,
      category,
      type === "expense" ? parseInt(amount) : -parseInt(amount),
    );

    toast.success(
      `${type === "expense" ? "Expense" : "Income"} added successfully`,
    );
    setIsOpen(false);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className=" md:mt-0 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          onClick={() => setIsOpen(true)}
        >
          <Plus size={16} className="mr-2" />
          Add Transaction
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Add Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type Selector */}
          <div className="flex items-center justify-center gap-4">
            {["expense", "income"].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setType(val as "income" | "expense")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-150 border ${
                  type === val
                    ? val === "expense"
                      ? "bg-red-100 text-red-700 border-red-400"
                      : "bg-green-100 text-green-700 border-green-400"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {val === "expense" ? "💸 Expense" : "💰 Income"}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <CategoryGroupCombobox
              selectedCategory={category}
              onChange={setCategoryChange}
              setCategoryGroup={setCategoryGroup}
              setSelectedCategory={setCategory}
            />
          </div>

          {/* Account */}
          <div className="space-y-2">
            <Label>Account</Label>
            <AccountSelect selected={account} setSelected={setAccount} />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <DatePicker />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder={
                type === "income"
                  ? "Freelance work, Salary, etc."
                  : "Groceries, Rent, Travel..."
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full ${
                type === "income"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                `Add ${type === "income" ? "Income" : "Expense"}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
