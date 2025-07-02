"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { getCategoryEmoji } from "@/lib/utils";

type Props = { data: any };

export default function MostExpenseContainer({ data }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          📊 Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {Object.entries(data).map(([category, spent], index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 20 }}
                className="flex items-center justify-center w-8 h-8 rounded-md bg-muted text-lg cursor-pointer"
              >
                {getCategoryEmoji(category)}
              </motion.div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium capitalize">{category}</p>
                  <p className="text-sm font-semibold">₹{spent as number}</p>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Static budget • 60% used</span>
                  <span className="text-muted-foreground">--%</span>
                </div>
              </div>
            </div>
            <Progress value={60} className="h-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
