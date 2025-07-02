import React, { Dispatch, SetStateAction } from "react";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryGroupCombobox } from "@/features/dashboard/components/addexpenseselect";
import { AccountSelect } from "@/features/dashboard/components/account-select";

interface EditExpenseSheetProps {
  editingExpense: any;
  account: string;
  setAccount: (account: string) => void;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  categoryGroup: string;
  setCategoryGroup: Dispatch<SetStateAction<string>>;
  onSave: (e: React.FormEvent) => void;
  onInputChange: (field: string, value: string) => void;
  onCancel: () => void;
}

export const EditExpenseSheet: React.FC<EditExpenseSheetProps> = ({
  editingExpense,
  account,
  setAccount,
  setCategory,
  setCategoryGroup,
  onSave,
  onInputChange,
  onCancel,
}) => {
  if (!editingExpense) return null;

  return (
    <SheetContent className="w-full sm:max-w-lg px-5">
      <SheetHeader>
        <SheetTitle>Edit Transaction</SheetTitle>
        <SheetDescription>
          Make changes to your transaction details below.
        </SheetDescription>
      </SheetHeader>

      <form onSubmit={onSave} className="space-y-6 mt-6">
        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={editingExpense.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="Enter transaction description"
            required
          />
        </div>

        {/* Category Field */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <CategoryGroupCombobox
            onChange={() => {}}
            selectedCategory={""}
            setCategoryGroup={setCategory}
            setSelectedCategory={setCategoryGroup}
          />
        </div>

        {/* Amount Field */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (NPR)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={editingExpense.amount}
            onChange={(e) => onInputChange("amount", e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        {/* Account Field */}
        <div className="space-y-2">
          <Label htmlFor="account">Account</Label>
          <AccountSelect selected={account} setSelected={setAccount} />
        </div>

        {/* Date Field */}
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={editingExpense.date}
            onChange={(e) => onInputChange("date", e.target.value)}
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button type="submit" className="flex-1">
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </SheetContent>
  );
};
