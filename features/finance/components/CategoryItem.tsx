"use client";
import { Progress } from "@/components/ui/progress";
import { TableCell, TableRow } from "@/components/ui/table";
import { useBudgetStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type CategoryItemProps = {
  name: string;
  assigned: number;
  spent: number;
  available: number;
  progressPercentage: number;
  groupName?: string;
  onAssignedChange?: (newValue: number) => void;
};

export function CategoryItem({
  name,
  assigned,
  spent,
  available,
  progressPercentage,
  groupName = "",
  onAssignedChange,
}: CategoryItemProps) {
  const setSelectedCategory = useBudgetStore(
    (state) => state.setSelectedCategory
  );
  const { updateCategory, selectedGroup, selectedCategory } = useBudgetStore(
    (state) => state
  );

  const [assignHover, setAssignHover] = useState(false);
  const [assgin, setAssgin] = useState<number>(assigned);
  const [inputValue, setInputValue] = useState(assigned.toString());
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useRef<HTMLTableCellElement>(null);
  const [categoryName, setCategoryName] = useState("");

  const isSelected = selectedCategory === name && selectedGroup === groupName;

  useEffect(() => {
    setInputValue(assigned.toString());
  }, [assigned]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    setSelectedCategory(name, groupName);
  };

  const handleCellMouseLeave = () => {
    if (!isEditing) {
      setAssignHover(false);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    setAssignHover(false);

    const numValue = parseFloat(inputValue) || 0;
    if (numValue !== assigned && onAssignedChange) {
      onAssignedChange(numValue);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
      updateCategory(groupName, name, {
        assign: parseInt(inputRef.current?.value || ""),
      });
      setAssgin(parseInt(inputRef.current?.value || assgin.toString()));
    } else if (e.key === "Escape") {
      setInputValue(assigned.toString());
      inputRef.current?.blur();
    }
  };

  return (
    <TableRow
      className={`text-md hover:bg-gray-100/10 cursor-pointer transition-colors`}
      onClick={handleClick}
    >
      <TableCell className="w-[61%] p-5">
        <Popover>
          <PopoverTrigger asChild>
            <span className="hover:underline cursor-pointer">{name}</span>
          </PopoverTrigger>
          <PopoverContent>
            <Input
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
            <div className="flex justify-between items-center mt-5">
              <Button variant={"secondary"}>
                <Trash />
                Delete
              </Button>
              <div className=" space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button
                  onClick={() =>
                    updateCategory(groupName, name, { name: categoryName })
                  }
                >
                  Ok
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Progress value={progressPercentage} className="mt-2 h-1" />
      </TableCell>

      <TableCell
        ref={cellRef}
        className="w-[13%] text-right p-5 relative"
        onMouseEnter={() => setAssignHover(true)}
        onMouseLeave={handleCellMouseLeave}
      >
        {assignHover || isEditing ? (
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onClick={handleInputClick}
            onKeyDown={handleInputKeyDown}
            className="text-right border-0 bg-transparent p-0 h-auto focus:ring-1 focus:ring-blue-500 focus:bg-white"
            placeholder="0"
          />
        ) : (
          <span>₹{assgin}</span>
        )}
      </TableCell>

      <TableCell className="w-[13%] text-right p-5">₹{spent}</TableCell>
      <TableCell className="w-[13%] text-right p-5">₹{available}</TableCell>
    </TableRow>
  );
}
