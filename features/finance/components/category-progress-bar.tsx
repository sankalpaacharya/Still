import React from "react";
import { Progress } from "@/components/ui/progress";

type Props = { target: number; assign: number; activity: number };

export default function CategoryProgressBar({
  target,
  activity,
  assign,
}: Props) {
  const fundProgress = (assign / target) * 100;
  console.log(target);

  return <Progress value={fundProgress} className="mt-2 h-1 " />;
}
