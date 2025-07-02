import { useEffect, useRef, useState } from "react";
import {
  assignMoney,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/features/finance/actions";
import { useBudgetStore } from "@/lib/store";
import toast from "react-hot-toast";
import type { Target } from "@/lib/store";

export function useCategoryItemLogic({
  name,
  assigned,
  groupName,
  id,
  target,
  onAssignedChange,
}: {
  name: string;
  assigned: number;
  groupName: string;
  id: string;
  target: Target;
  onAssignedChange?: (val: number) => void;
}) {
  const { updateCategory, deleteCategory, setSelectedCategory, selectedMonth } =
    useBudgetStore();

  const [assignedValue, setAssignedValue] = useState(assigned);
  const [inputValue, setInputValue] = useState(assigned.toString());
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(name);
  const [isSaving, setIsSaving] = useState(false);

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

  const saveAmount = async () => {
    const numValue = parseFloat(inputValue) || 0;
    setIsSaving(true);
    try {
      const result = await assignMoney({
        month: new Date(),
        assign: numValue,
        selectedGroup: groupName,
        selectedCategory: name,
      });

      if (result.error) toast.error(result.message);
      else {
        toast.success(result.message);
        updateCategory(groupName, name, { assign: numValue });
        setAssignedValue(numValue);
        onAssignedChange?.(numValue);
      }
    } catch {
      toast.error("Failed to save assignment");
    } finally {
      setIsSaving(false);
      setIsEditingAmount(false);
    }
  };

  const cancelAmountEdit = () => {
    setInputValue(assignedValue.toString());
    setIsEditingAmount(false);
  };

  const saveName = async () => {
    if (nameValue.trim() && nameValue !== name) {
      const result = await updateCategoryAction({
        title: name,
        categoryGroupName: groupName,
        newTitle: nameValue,
      });
      if (result.error) toast.error(result.message);
      else toast.success(result.message);

      updateCategory(groupName, name, { name: nameValue.trim() });
    }
    setIsEditingName(false);
  };

  const cancelNameEdit = () => {
    setNameValue(name);
    setIsEditingName(false);
  };

  const deleteCategoryFn = async () => {
    deleteCategory(groupName, name);
    const result = await deleteCategoryAction({ categoryID: id });
    if (result.error) toast.error(result.message);
    else toast.success(result.message);
  };

  return {
    assignedValue,
    inputValue,
    nameValue,
    isEditingAmount,
    isEditingName,
    isSaving,
    amountInputRef,
    nameInputRef,
    selectedMonth,
    setIsEditingAmount,
    setIsEditingName,
    setInputValue,
    setNameValue,
    saveAmount,
    cancelAmountEdit,
    saveName,
    cancelNameEdit,
    deleteCategoryFn,
    setSelectedCategory,
  };
}
