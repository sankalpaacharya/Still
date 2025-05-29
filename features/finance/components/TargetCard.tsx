"use client";
import { useState, useEffect } from "react";
import { Target, SquarePen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTargetForm } from "@/hooks/useTargetForm";
import { TargetForm } from "./targetform";
import { Button } from "@/components/ui/button";

type TargetCardProps = {
  title: string;
};

export function TargetCard({ title = "Select a category" }: TargetCardProps) {
  const {
    formData,
    currentCategory,
    updateFormData,
    saveTarget,
    deleteTarget,
    resetForm,
    error,
    canSave,
  } = useTargetForm();

  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "yearly">(
    "weekly"
  );

  console.log(currentCategory?.target);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentCategory?.target) {
      setActiveTab(
        currentCategory.target.type as "weekly" | "monthly" | "yearly"
      );
    }
  }, [currentCategory?.target]);
  useEffect(() => {
    if (error) {
      setIsEditing(true);
    }
  }, [error]);

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
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            {currentCategory?.target === null ? (
              <span className="flex items-center gap-2">Create Target</span>
            ) : (
              <span className="flex items-center gap-2">
                <SquarePen />
                Edit Target
              </span>
            )}
          </Button>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as typeof activeTab)}
          >
            <TabsList className="w-full">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>

            {(["weekly", "monthly", "yearly"] as const).map((targetType) => (
              <TabsContent key={targetType} value={targetType}>
                <TargetForm
                  type={targetType}
                  amount={formData[targetType].amount}
                  schedule={formData[targetType].schedule}
                  onAmountChange={(amount) =>
                    updateFormData(targetType, "amount", amount)
                  }
                  onScheduleChange={(schedule) =>
                    updateFormData(targetType, "schedule", schedule)
                  }
                  onSave={() => {
                    saveTarget(targetType);
                    setIsEditing(false);
                  }}
                  onDelete={() => {
                    deleteTarget();
                    setIsEditing(false);
                  }}
                  onCancel={() => {
                    setIsEditing(false);
                  }}
                  canSave={canSave}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
