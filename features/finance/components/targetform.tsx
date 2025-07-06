import { Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TargetFormProps = {
  type: "weekly" | "monthly" | "yearly";
  amount: number;
  schedule: string;
  onAmountChange: (amount: number) => void;
  onScheduleChange: (schedule: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
  canSave: boolean;
};

export function TargetForm({
  type,
  amount,
  schedule,
  onAmountChange,
  onScheduleChange,
  onSave,
  onDelete,
  onCancel,
  canSave,
}: TargetFormProps) {
  const getScheduleOptions = () => {
    if (type === "weekly") {
      return [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].map((day) => ({ value: day.toLowerCase(), label: day }));
    }

    if (type === "monthly") {
      return Array.from({ length: 31 }, (_, i) => ({
        value: (i + 1).toString(),
        label: `${i + 1}${
          i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"
        }`,
      }));
    }

    return [];
  };

  const getScheduleLabel = () => {
    return type === "weekly"
      ? "Every"
      : type === "monthly"
        ? "On the"
        : "Target Date";
  };

  const renderScheduleInput = () => {
    if (type === "yearly") {
      return (
        <Input
          type="date"
          value={schedule}
          className="w-full"
          onChange={(e) => onScheduleChange(e.target.value)}
        />
      );
    }

    return (
      <Select value={schedule} onValueChange={onScheduleChange}>
        <SelectTrigger>
          <SelectValue
            placeholder={`Select ${type === "weekly" ? "day" : "date"}`}
          />
        </SelectTrigger>
        <SelectContent>
          {getScheduleOptions().map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="space-y-4 mt-2">
      <div className="grid w-full items-center gap-1.5">
        <Label>I need ($)</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(Number(e.target.value) || 0)}
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label>{getScheduleLabel()}</Label>
        {renderScheduleInput()}
      </div>

      <div className="flex justify-between">
        <Button
          className="text-red-500 hover:bg-red-600/20"
          variant="ghost"
          onClick={onDelete}
          disabled={!canSave}
        >
          <Trash />
          Delete
        </Button>
        <div className="space-x-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!canSave}>
            Save Target
          </Button>
        </div>
      </div>
    </div>
  );
}
