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

type AddCategoryPopoverProps = {
  onAddCategory?: (name: string) => void;
  className?: string;
};

export function AddCategoryPopover({
  onAddCategory,
  className,
}: AddCategoryPopoverProps) {
  const [categoryName, setCategoryName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (categoryName.trim() && onAddCategory) {
      onAddCategory(categoryName.trim());
      setCategoryName("");
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setCategoryName("");
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={`p-1 rounded-full bg-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer ${
            className || ""
          }`}
        >
          <Plus size={15} />
        </div>
      </PopoverTrigger>
      <PopoverContent onClick={(e) => e.stopPropagation()}>
        <Input
          placeholder="New Category"
          className="mb-4"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            } else if (e.key === "Escape") {
              handleCancel();
            }
          }}
        />
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Ok</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
