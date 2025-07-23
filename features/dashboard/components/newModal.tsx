"use client";
import ExpenseSheet from "@/features/cashflow/components/expense-sheet";
import { Button } from "@/components/ui/button";

export default function NewAddExpenseModalButton() {
  return <ExpenseSheet>{<Button>Add Expense</Button>}</ExpenseSheet>;
}
