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
import { CategoryGroupCombobox } from "./addexpenseselect";
import { Plus } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { addExpenseAction } from "../actions";
import { useBudgetStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function AddExpenseModalButton() {
  const { addActivity } = useBudgetStore((state) => state);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [categoryGroup, setCategoryGroup] = useState("");
  const [categoryChange, setCategoryChange] = useState<any>({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) {
      toast.error("Fill all details");
    }
    addExpenseAction({
      category,
      categoryGroup,
      amount: parseInt(amount),
      description,
      date,
      categoryId: categoryChange.categoryID,
    });
    addActivity(categoryGroup, category, parseInt(amount));

    setDescription("");
    setAmount("");
    setCategory("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
          <Plus size={16} className="mr-2" /> Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-gradient">Add New Expense</DialogTitle>
            <DialogDescription>
              Track your spending by adding a new expense
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What did you purchase?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/5"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
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
              <Label htmlFor="date">Date</Label>
              <DatePicker />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit" className="">
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
