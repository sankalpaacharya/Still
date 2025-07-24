"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { getCategoryEmoji } from "@/lib/utils";
import { cn } from "@/lib/utils";

type CategoryItem = {
  name: string;
  amount: number;
  assigned: number;
};

type Props = {
  data: CategoryItem[];
};

export default function MostExpenseContainer({ data }: Props) {
  return (
    <Card className="bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          📊 Spending by Category
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {data.map((item, index) => {
          const percentage =
            item.assigned > 0 ? (item.amount / item.assigned) * 100 : 0;
          const label =
            item.assigned === 0
              ? "Unassigned"
              : percentage > 100
                ? "Overspent"
                : percentage > 80
                  ? "Near Budget"
                  : "Under Budget";

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 20 }}
                  className="flex items-center justify-center w-8 h-8 rounded-md bg-muted text-lg cursor-pointer"
                >
                  {getCategoryEmoji(item.name)}
                </motion.div>

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium capitalize">
                      {item.name}
                    </p>
                    <p className="text-sm font-semibold">
                      ${item.amount.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>
                      {item.assigned === 0
                        ? "No Budget Assigned"
                        : `${label} • ${Math.round(percentage)}% used`}
                    </span>
                    <span className="text-muted-foreground">
                      Budget: ${item.assigned.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <Progress value={percentage} className={cn("h-1")} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
