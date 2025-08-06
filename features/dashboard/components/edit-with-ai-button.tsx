"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { editWithAIServerAction } from "@/features/dashboard/actions/index";

interface EditWithAIButtonProps {
  expenses: any[];
  onEdit: (editedExpenses: any[]) => void;
}

export function EditWithAIButton({ expenses, onEdit }: EditWithAIButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleEditWithAI = () => {
    setLoading(true);
    startTransition(async () => {
      try {
        const transactionData: { [key: string]: any } = {};
        expenses.forEach((item: any) => {
          transactionData[item.name] = {
            amount: item.amount,
            category_id: item.category_id,
            user_id: item.user_id,
            category: item.category,
            date: item.date,
          };
        });

        const result = await editWithAIServerAction(transactionData, query);
        onEdit(result);
        setOpen(false);
        setQuery("");
      } catch (error) {
        console.error("AI edit failed", error);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit with AI</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogTitle>Edit Expenses with AI</DialogTitle>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe how you want to edit the expenses..."
          rows={4}
        />
        <DialogFooter className="!justify-end">
          <Button
            onClick={handleEditWithAI}
            disabled={loading || isPending || !query}
          >
            {loading || isPending ? "Editing..." : "Apply AI Edit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditWithAIButton;
