"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { categoryNeedText } from "@/utils/categoryNeedText";
import { getCategoryEmoji } from "@/lib/utils";
import CategoryProgressBar from "./category-progress-bar";
import { Button } from "@/components/ui/button";
import { Edit3, Trash, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCategoryItemLogic } from "@/hooks/useCategoryItem";
import type { Target } from "@/lib/store";

export type CategoryItemProps = {
  id: string;
  name: string;
  assigned: number;
  spent: number;
  available: number;
  groupName?: string;
  target: Target;
  onAssignedChange?: (newValue: number) => void;
};

export function CategoryItem({
  id,
  name,
  assigned,
  spent,
  available,
  target,
  groupName = "",
  onAssignedChange,
}: CategoryItemProps) {
  const logic = useCategoryItemLogic({
    id,
    name,
    assigned,
    groupName,
    target,
    onAssignedChange,
  });

  const handleRowClick = () => {
    if (!logic.isEditingAmount && !logic.isEditingName) {
      logic.setSelectedCategory(name, groupName);
    }
  };

  return (
    <TableRow
      className="group hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={handleRowClick}
    >
      <TableCell className="w-[61%] p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {logic.isEditingName ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  ref={logic.nameInputRef}
                  value={logic.nameValue}
                  onChange={(e) => logic.setNameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") logic.saveName();
                    else if (e.key === "Escape") logic.cancelNameEdit();
                  }}
                  className="flex-1 h-8"
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={logic.saveName}
                  className="h-8 w-8 p-0"
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={logic.cancelNameEdit}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between flex-1">
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-lg transition-transform duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110"
                      style={{ transformOrigin: "center" }}
                    >
                      {getCategoryEmoji(name)}
                    </span>
                    <p className="font-medium">{name}</p>
                  </div>
                  <p className="pr-5 md:pr-10 text-muted-foreground">
                    {categoryNeedText({
                      target,
                      assign: logic.assignedValue,
                      selectedMonth: logic.selectedMonth,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      logic.setIsEditingName(true);
                    }}
                    className="h-7 w-7 p-0"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      logic.deleteCategoryFn();
                    }}
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
            assign={logic.assignedValue}
            target={target}
          />
        </div>
      </TableCell>

      <TableCell className="w-[13%] text-right p-4">
        {logic.isEditingAmount ? (
          <div className="flex items-center justify-end gap-2">
            <Input
              ref={logic.amountInputRef}
              value={logic.inputValue}
              onChange={(e) => logic.setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") logic.saveAmount();
                if (e.key === "Escape") logic.cancelAmountEdit();
              }}
              className="w-20 text-right h-8"
              onClick={(e) => e.stopPropagation()}
              disabled={logic.isSaving}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={logic.saveAmount}
              className="h-8 w-8 p-0"
              disabled={logic.isSaving}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={logic.cancelAmountEdit}
              className="h-8 w-8 p-0"
              disabled={logic.isSaving}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm font-medium">${logic.assignedValue}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                logic.setIsEditingAmount(true);
              }}
              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </TableCell>

      <TableCell className="w-[13%] text-right p-4">
        <span className="text-sm">${spent}</span>
      </TableCell>

      <TableCell className="w-[13%] text-right p-4">
        <span
          className={`text-sm font-medium ${available < 0 ? "text-destructive" : "text-green-600"}`}
        >
          ${logic.assignedValue - spent}
        </span>
      </TableCell>
    </TableRow>
  );
}
