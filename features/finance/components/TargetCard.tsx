"use client";

import { Target, Trash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type TargetCardProps = {
  title: string;
  onSaveTarget?: (period: string, amount: number) => void;
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
    const amountInput = document.getElementById("target-amount") as HTMLInputElement;
    const amount = Number(amountInput?.value || 0);
    onSaveTarget && onSaveTarget(period, amount);
  };

  return (
    <div className="w-[30%] p-5 rounded-md bg-gray-500/10 h-[40rem]">
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
          {["weekly", "monthly", "yearly"].map((period) => (
            <TabsContent key={period} value={period} className="space-y-4 mt-2">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="target-amount">I need (₹) </Label>
                <Input type="number" id="target-amount" defaultValue="0" />
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
                  <Button onClick={() => handleSave(period)}>
                    Save Target
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
