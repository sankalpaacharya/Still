import React from "react";
import { Progress } from "@/components/ui/progress";
import { getMonthlyNeedAmount } from "@/utils/categoryNeedText";
import { Target } from "@/lib/store";

type Props = { target: Target; assign: number; activity: number };

export default function CategoryProgressBar({
  target,
  activity,
  assign,
}: Props) {
  const getMonthlyNeed = getMonthlyNeedAmount(target);
  console.log("monthly needed", getMonthlyNeed, assign);
  const fundProgress = (assign / getMonthlyNeed) * 100;
  console.log("fund progress", fundProgress);
  return <Progress value={fundProgress} className="mt-2 h-1 " />;
}
