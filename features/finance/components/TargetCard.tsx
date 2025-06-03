"use client";
import { useState, useEffect } from "react";
import { Target, Edit3, Plus, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTargetForm } from "@/hooks/useTargetForm";
import { TargetForm } from "./targetform";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "date-fns";

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
    error,
    canSave,
  } = useTargetForm();

  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "yearly">(
    "weekly"
  );
  const [isEditing, setIsEditing] = useState(false);

  const hasTarget =
    currentCategory?.target !== null && currentCategory?.target !== undefined;
  const currentTarget = currentCategory?.target;

  useEffect(() => {
    if (currentTarget) {
      setActiveTab(currentTarget.type as "weekly" | "monthly" | "yearly");
    }
  }, [currentTarget]);

  useEffect(() => {
    if (error) {
      setIsEditing(true);
    }
  }, [error]);

  const formatTargetDisplay = () => {
    if (!hasTarget || !currentTarget) return null;
    const { need, type } = currentTarget;
    if (currentTarget.type === "weekly") {
      return {
        amount: `₹${need}`,
        frequency: type,
        schedule: currentTarget.every || "No end date",
      };
    }
    if (currentTarget.type === "monthly") {
      return {
        amount: `₹${need}`,
        frequency: type,
        schedule: currentTarget.on || "No end date",
      };
    }
    if (currentTarget.type === "yearly") {
      return {
        amount: `₹${need}`,
        frequency: type,
        schedule: currentTarget.date || "No end date",
      };
    }
  };

  const targetDisplay = formatTargetDisplay();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          Target for {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {hasTarget && targetDisplay && !isEditing ? (
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Current Target
                </span>
                <Badge variant="secondary" className="capitalize">
                  {targetDisplay.frequency}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="text-lg font-semibold">
                  {targetDisplay.amount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Frequency:
                </span>
                <span className="text-sm capitalize">
                  {targetDisplay.frequency}
                </span>
              </div>
              {targetDisplay.schedule !== "No end date" && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Schedule:
                  </span>
                  <span className="text-sm">
                    {targetDisplay.schedule.toString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {!hasTarget && !isEditing ? (
          <div className="text-center py-8 px-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <Target className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="font-medium mb-2">No target set</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set a target to track your progress and stay motivated
            </p>
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Target
            </Button>
          </div>
        ) : null}

        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                {hasTarget ? "Edit Target" : "Create Target"}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as typeof activeTab)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>

              {(["weekly", "monthly", "yearly"] as const).map((targetType) => (
                <TabsContent
                  key={targetType}
                  value={targetType}
                  className="mt-4"
                >
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
          </div>
        ) : null}

        {!isEditing && (
          <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded">
            💡 Targets help you save consistently and reach your financial goals
          </div>
        )}
      </CardContent>
    </Card>
  );
}
