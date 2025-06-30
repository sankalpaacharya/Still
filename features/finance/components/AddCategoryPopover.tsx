"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBudgetStore } from "@/lib/store";
import toast from "react-hot-toast";
import { addCategoryAction } from "../actions/categories";

type AddCategoryPopoverProps = {
  className?: string;
  categoryGroupName: string;
};

export function AddCategoryPopover({
  categoryGroupName,
  className,
}: AddCategoryPopoverProps) {
  const [categoryName, setCategoryName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { addCategory, groups } = useBudgetStore();

  const categoryExists = (name: string): boolean => {
    const group = groups.find((g) => g.name === categoryGroupName);
    return (
      group?.categories.some(
        (category) => category.name.toLowerCase() === name.toLowerCase(),
      ) ?? false
    );
  };

  const resetForm = () => {
    setCategoryName("");
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      toast.error("Category name cannot be empty");
      return;
    }

    if (categoryExists(trimmedName)) {
      toast.error("Category with this name already exists");
      return;
    }

    try {
      addCategory(categoryGroupName, trimmedName);
      resetForm();
      const result = await addCategoryAction({
        categoryGroupName,
        title: trimmedName,
      });
      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add category");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      resetForm();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={`p-1 rounded-full bg-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer ${
            className || ""
          }`}
          role="button"
          tabIndex={0}
          aria-label="Add new category"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
        >
          <Plus size={15} />
        </div>
      </PopoverTrigger>
      <PopoverContent onClick={(e) => e.stopPropagation()} className="w-80">
        <div className="space-y-4">
          <div>
            <label htmlFor="category-name" className="sr-only">
              Category Name
            </label>
            <Input
              id="category-name"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={resetForm} size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!categoryName.trim()}
              size="sm"
            >
              Add Category
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
