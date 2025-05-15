// components/ExpenseInput.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExpenseInputProps {
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  type?: string;
  icon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ExpenseInput: React.FC<ExpenseInputProps> = ({
  id,
  label,
  placeholder,
  value,
  type = "text",
  icon,
  onChange,
}) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={id} className="text-right">
      {label}
    </Label>
    <div className="col-span-3 flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-md border border-zinc-700 focus-within:ring-2 focus-within:ring-purple-500">
      {icon && <span className="text-zinc-400">{icon}</span>}
      <Input
        id={id}
        placeholder={placeholder}
        defaultValue={value}
        type={type}
        className="bg-transparent border-none focus-visible:ring-0 p-0"
        onChange={onChange}
      />
    </div>
  </div>
);
