"use client";
import { Target, Trash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type TargetCardProps = {
  title: string;
  onSaveTarget?: (period: string, amount: number, schedule: string) => void;
  onDeleteTarget?: () => void;
  onCancel?: () => void;
};

export function TargetCard({
  title = "📺 Tv Streaming",
  onSaveTarget,
  onDeleteTarget,
  onCancel,
}: TargetCardProps) {
  const handleSave = (period: string) => {
    const amountInput = document.getElementById(
      `target-amount-${period}`
    ) as HTMLInputElement;
    const scheduleSelect = document.getElementById(`schedule-${period}`) as
      | HTMLSelectElement
      | HTMLInputElement;

    const amount = Number(amountInput?.value || 0);
    const schedule = scheduleSelect?.value || "";

    onSaveTarget && onSaveTarget(period, amount, schedule);
  };

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const monthDates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-md p-5 rounded-md bg-gray-500/10 min-h-96">
      <h2 className="text-md font-semibold">{title}</h2>
      <div className="mt-10 p-5 rounded-md bg-white/10 space-y-1">
        <h2 className="text-md flex gap-2 items-center">
          <Target size={16} />
          Target
        </h2>
        <div className="mt-5 space-y-2 mb-6">
          <p className="text-xs font-semibold">
            How much do you need for {title}?
          </p>
          <p className="text-sm">
            When you create a target, we'll let you know how much money to set
            aside to stay on track over time.
          </p>
        </div>
        <Tabs defaultValue="weekly">
          <TabsList className="w-full">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>

          {/* Weekly Tab */}
          <TabsContent value="weekly" className="space-y-4 mt-2">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="target-amount-weekly">I need (₹)</Label>
              <Input type="number" id="target-amount-weekly" defaultValue="0" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="schedule-weekly">Every</Label>
              <Select>
                <SelectTrigger id="schedule-weekly" className="w-full">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {weekDays.map((day) => (
                    <SelectItem key={day} value={day.toLowerCase()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between">
              <Button
                className="text-red-500 hover:bg-red-600/20"
                variant="ghost"
                onClick={onDeleteTarget}
              >
                <Trash />
                Delete
              </Button>
              <div className="space-x-3">
                <Button variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={() => handleSave("weekly")}>
                  Save Target
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Monthly Tab */}
          <TabsContent value="monthly" className="space-y-4 mt-2">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="target-amount-monthly">I need (₹)</Label>
              <Input
                type="number"
                id="target-amount-monthly"
                defaultValue="0"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="schedule-monthly">On the</Label>
              <Select>
                <SelectTrigger id="schedule-monthly" className="w-full">
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {monthDates.map((date) => (
                    <SelectItem key={date} value={date.toString()}>
                      {date}
                      {date === 1
                        ? "st"
                        : date === 2
                        ? "nd"
                        : date === 3
                        ? "rd"
                        : "th"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between">
              <Button
                className="text-red-500 hover:bg-red-600/20"
                variant="ghost"
                onClick={onDeleteTarget}
              >
                <Trash />
                Delete
              </Button>
              <div className="space-x-3">
                <Button variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={() => handleSave("monthly")}>
                  Save Target
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Yearly Tab */}
          <TabsContent value="yearly" className="space-y-4 mt-2">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="target-amount-yearly">I need (₹)</Label>
              <Input type="number" id="target-amount-yearly" defaultValue="0" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="schedule-yearly">Target Date</Label>
              <Input type="date" id="schedule-yearly" />
            </div>
            <div className="flex justify-between">
              <Button
                className="text-red-500 hover:bg-red-600/20"
                variant="ghost"
                onClick={onDeleteTarget}
              >
                <Trash />
                Delete
              </Button>
              <div className="space-x-3">
                <Button variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={() => handleSave("yearly")}>
                  Save Target
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
