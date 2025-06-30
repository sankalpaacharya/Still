"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const TopSpentCategories = ({ data = [] }) => {
  const mockData = [
    {
      category: "Food & Dining",
      spent: 8450,
      budget: 10000,
      change: 15,
      emoji: "🍕",
      barColor: "bg-yellow-500",
    },
    {
      category: "Transportation",
      spent: 3200,
      budget: 4000,
      change: -5,
      emoji: "🚗",
      barColor: "bg-yellow-500",
    },
    {
      category: "Shopping",
      spent: 2800,
      budget: 3000,
      change: 25,
      emoji: "🛍️",
      barColor: "bg-red-500",
    },
    {
      category: "Entertainment",
      spent: 1500,
      budget: 2000,
      change: -10,
      emoji: "🎮",
      barColor: "bg-green-500",
    },
    {
      category: "Utilities",
      spent: 2500,
      budget: 2500,
      change: 0,
      emoji: "⚡",
      barColor: "bg-red-500",
    },
  ];

  const categories = data.length > 0 ? data : mockData;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          📊 Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {categories.map((item, index) => {
          const percentUsed = Math.round((item.spent / item.budget) * 100);
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 20 }}
                  className="flex items-center justify-center w-8 h-8 rounded-md bg-muted text-lg cursor-pointer"
                >
                  {item.emoji}
                </motion.div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{item.category}</p>
                    <p className="text-sm font-semibold">
                      ₹{item.spent.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>
                      ₹{item.budget.toLocaleString()} budget • {percentUsed}%
                      used
                    </span>
                    <span
                      className={`${
                        item.change > 0
                          ? "text-red-500"
                          : item.change < 0
                            ? "text-green-500"
                            : "text-muted-foreground"
                      }`}
                    >
                      {item.change > 0 ? "+" : ""}
                      {item.change}%
                    </span>
                  </div>
                </div>
              </div>
              <Progress value={percentUsed} className="h-1" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TopSpentCategories;
