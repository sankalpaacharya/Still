"use client";
import { useEffect, useState } from "react";
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
import { useBudgetStore } from "@/lib/store";
import toast from "react-hot-toast";
import { MonthlyTarget, WeeklyTarget, YearlyTarget } from "@/lib/store";
import { Category } from "@/lib/store";

type TargetCardProps = {
  title: string;
};

export function TargetCard({ title = "Select a category" }: TargetCardProps) {
  const { selectedCategory, selectedGroup, updateCategoryTarget, groups } =
    useBudgetStore((state) => state);
  const [activeTab, setActiveTab] = useState("weekly");
  const [activeCategoryTarget, setActiveCategoryTarget] = useState<Category>();

  const targetAmount = groups
    .find((grp) => grp.name === selectedGroup)
    ?.categories.find((category) => category.name === selectedCategory);

  useEffect(() => {
    setActiveTab(targetAmount?.target?.type || "weekly");
  }, [targetAmount?.target?.type]);

  useEffect(() => {
    setActiveCategoryTarget(targetAmount);
  }, [targetAmount]);

  const [weeklyAmount, setWeeklyAmount] = useState<number>(0);
  const [weeklySchedule, setWeeklySchedule] = useState<string>("");

  const [monthlyAmount, setMonthlyAmount] = useState<number>(0);
  const [monthlySchedule, setMonthlySchedule] = useState<string>("");

  const [yearlyAmount, setYearlyAmount] = useState<number>(0);
  const [yearlySchedule, setYearlySchedule] = useState<string>("");

  useEffect(() => {
    if (activeCategoryTarget?.target) {
      const target = activeCategoryTarget.target;

      if (target.type === "weekly") {
        setWeeklyAmount(target.need);
        setWeeklySchedule(target.every);
      } else if (target.type === "monthly") {
        setMonthlyAmount(target.need);
        setMonthlySchedule(target.on.toString());
      } else if (target.type === "yearly") {
        setYearlyAmount(target.need);
        setYearlySchedule(target.date.toISOString().split("T")[0]);
      }
    } else {
      setWeeklyAmount(0);
      setWeeklySchedule("");
      setMonthlyAmount(0);
      setMonthlySchedule("");
      setYearlyAmount(0);
      setYearlySchedule("");
    }
  }, [activeCategoryTarget]);

  const handleSave = (period: string) => {
    if (!selectedCategory || !selectedGroup) {
      return;
    }

    let target: WeeklyTarget | YearlyTarget | MonthlyTarget | null = null;

    if (period === "weekly") {
      if (!weeklySchedule) {
        toast.error("Please select a day for weekly target");
        return;
      }
      target = {
        type: "weekly",
        need: weeklyAmount,
        every: weeklySchedule,
      };
    } else if (period === "monthly") {
      if (!monthlySchedule) {
        toast.error("Please select a date for monthly target");
        return;
      }
      target = {
        type: "monthly",
        need: monthlyAmount,
        on: Number(monthlySchedule),
      };
    } else if (period === "yearly") {
      if (!yearlySchedule) {
        toast.error("Please select a target date");
        return;
      }
      target = {
        type: "yearly",
        need: yearlyAmount,
        date: new Date(yearlySchedule),
      };
    }

    updateCategoryTarget(selectedGroup, selectedCategory, target);
    toast.success("Target saved successfully");
  };

  const handleDelete = () => {
    if (selectedCategory && selectedGroup) {
      updateCategoryTarget(selectedGroup, selectedCategory, null);
      toast.success("Target deleted");
    }
  };

  const handleCancel = (period: string) => {
    if (period === "weekly") {
      setWeeklyAmount(0);
      setWeeklySchedule("");
    } else if (period === "monthly") {
      setMonthlyAmount(0);
      setMonthlySchedule("");
    } else if (period === "yearly") {
      setYearlyAmount(0);
      setYearlySchedule("");
    }
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>

          {/* Weekly Tab */}
          <TabsContent value="weekly" className="space-y-4 mt-2">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="target-amount-weekly">I need (₹)</Label>
              <Input
                type="number"
                id="target-amount-weekly"
                value={weeklyAmount}
                onChange={(e) => setWeeklyAmount(Number(e.target.value) || 0)}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="schedule-weekly">Every</Label>
              <Select value={weeklySchedule} onValueChange={setWeeklySchedule}>
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
                onClick={handleDelete}
                disabled={!selectedCategory || !selectedGroup}
              >
                <Trash />
                Delete
              </Button>
              <div className="space-x-3">
                <Button variant="ghost" onClick={() => handleCancel("weekly")}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSave("weekly")}
                  disabled={!selectedCategory || !selectedGroup}
                >
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
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="schedule-monthly">On the</Label>
              <Select
                value={monthlySchedule}
                onValueChange={setMonthlySchedule}
              >
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
                onClick={handleDelete}
                disabled={!selectedCategory || !selectedGroup}
              >
                <Trash />
                Delete
              </Button>
              <div className="space-x-3">
                <Button variant="ghost" onClick={() => handleCancel("monthly")}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSave("monthly")}
                  disabled={!selectedCategory || !selectedGroup}
                >
                  Save Target
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Yearly Tab */}
          <TabsContent value="yearly" className="space-y-4 mt-2">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="target-amount-yearly">I need (₹)</Label>
              <Input
                type="number"
                id="target-amount-yearly"
                value={yearlyAmount}
                onChange={(e) => setYearlyAmount(Number(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="schedule-yearly">Target Date</Label>
              <Input
                type="date"
                id="schedule-yearly"
                value={yearlySchedule}
                onChange={(e) => setYearlySchedule(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <Button
                className="text-red-500 hover:bg-red-600/20"
                variant="ghost"
                onClick={handleDelete}
                disabled={!selectedCategory || !selectedGroup}
              >
                <Trash />
                Delete
              </Button>
              <div className="space-x-3">
                <Button variant="ghost" onClick={() => handleCancel("yearly")}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSave("yearly")}
                  disabled={!selectedCategory || !selectedGroup}
                >
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
