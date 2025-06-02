"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { useBudgetStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Edit3, Check, X } from "lucide-react";
import CategoryProgressBar from "./category-progress-bar";

type CategoryItemProps = {
  name: string;
  assigned: number;
  spent: number;
  available: number;
  groupName?: string;
  target: number;
  onAssignedChange?: (newValue: number) => void;
};

export function CategoryItem({
  name,
  assigned,
  spent,
  available,
  target,
  groupName = "",
  onAssignedChange,
}: CategoryItemProps) {
  const setSelectedCategory = useBudgetStore(
    (state) => state.setSelectedCategory
  );
  const { updateCategory, selectedGroup, selectedCategory, deleteCategory } =
    useBudgetStore((state) => state);

  const [assignedValue, setAssignedValue] = useState(assigned);
  const [inputValue, setInputValue] = useState(assigned.toString());
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(name);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAssignedValue(assigned);
    setInputValue(assigned.toString());
  }, [assigned]);

  useEffect(() => {
    if (isEditingAmount && amountInputRef.current) {
      amountInputRef.current.focus();
      amountInputRef.current.select();
    }
  }, [isEditingAmount]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleRowClick = () => {
    if (!isEditingAmount && !isEditingName) {
      setSelectedCategory(name, groupName);
    }
  };

  const handleAmountEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingAmount(true);
  };

  const handleNameEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingName(true);
  };

  const handleAmountSave = () => {
    const numValue = parseFloat(inputValue) || 0;
    setAssignedValue(numValue);
    updateCategory(groupName, name, { assign: numValue });
    if (onAssignedChange) {
      onAssignedChange(numValue);
    }
    setIsEditingAmount(false);
  };

  const handleAmountCancel = () => {
    setInputValue(assignedValue.toString());
    setIsEditingAmount(false);
  };

  const handleNameSave = () => {
    if (nameValue.trim() && nameValue !== name) {
      updateCategory(groupName, name, { name: nameValue.trim() });
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setNameValue(name);
    setIsEditingName(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCategory(groupName, name);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: "amount" | "name") => {
    if (e.key === "Enter") {
      if (action === "amount") {
        handleAmountSave();
      } else {
        handleNameSave();
      }
    } else if (e.key === "Escape") {
      if (action === "amount") {
        handleAmountCancel();
      } else {
        handleNameCancel();
      }
    }
  };

  return (
    <TableRow
      className={`group hover:bg-muted/50 cursor-pointer transition-colors`}
      onClick={handleRowClick}
    >
      {/* Category Name Cell */}
      <TableCell className="w-[61%] p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {isEditingName ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  ref={nameInputRef}
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "name")}
                  className="flex-1 h-8"
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleNameSave}
                  className="h-8 w-8 p-0"
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleNameCancel}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between flex-1">
                <span className="font-medium">{name}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleNameEdit}
                    className="h-7 w-7 p-0"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDelete}
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <CategoryProgressBar
            activity={spent}
            assign={assignedValue}
            target={target}
          />
        </div>
      </TableCell>

      <TableCell className="w-[13%] text-right p-4">
        {isEditingAmount ? (
          <div className="flex items-center justify-end gap-2">
            <Input
              ref={amountInputRef}
              value={inputValue}
              onChange={handleAmountChange}
              onKeyDown={(e) => handleKeyDown(e, "amount")}
              className="w-20 text-right h-8"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAmountSave}
              className="h-8 w-8 p-0"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAmountCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm font-medium">₹{assignedValue}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAmountEdit}
              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </TableCell>

      <TableCell className="w-[13%] text-right p-4">
        <span className="text-sm">₹{spent}</span>
      </TableCell>

      <TableCell className="w-[13%] text-right p-4">
        <span
          className={`text-sm font-medium ${
            available < 0 ? "text-destructive" : "text-green-600"
          }`}
        >
          ₹{available}
        </span>
      </TableCell>
    </TableRow>
  );
}
