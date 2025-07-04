import React from "react";
import { Progress } from "@/components/ui/progress";
import { getMonthlyNeedAmount } from "@/utils/categoryNeedText";
import { Target } from "@/lib/store";

type Props = { target: Target; assign: number; activity: number };

export default function CategoryProgressBar({ target, assign }: Props) {
  if (target === null) {
    if (assign > 0) return <Progress value={100} className="mt-2 h-1 " />;
    return <Progress value={0} className="mt-2 h-1 " />;
  }
  const getMonthlyNeed = getMonthlyNeedAmount(target);
  const fundProgress = (assign / getMonthlyNeed) * 100;
  return <Progress value={fundProgress} className="mt-2 h-1 " />;
}
