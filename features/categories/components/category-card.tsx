"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  name: string;
  icon: string;
  currentAmount: number;
  budgetAmount: number;
  transactionCount: number;
  trend: {
    direction: "up" | "down";
    percentage: number;
  };
  gradient: string;
  onClick?: () => void;
}

export default function CategoryCard({
  name,
  icon,
  currentAmount,
  budgetAmount,
  transactionCount,
  trend,
  gradient,
  onClick,
}: CategoryCardProps) {
  const progress = (currentAmount / budgetAmount) * 100;
  const remaining = budgetAmount - currentAmount;
  const average = Math.round(currentAmount / transactionCount);

  return (
    <Card className="bg-card/50 to-card w-md" onClick={onClick}>
      <CardContent className="p-7">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg transition-transform duration-300 hover:scale-110`}
            >
              {icon}
            </div>
            <div className="mt-3">
              <div className="text-lg font-semibold text-white">{name}</div>
              <div className="text-sm text-gray-400">
                {transactionCount} transactions
              </div>
            </div>
          </div>
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border ${
              trend.direction === "up"
                ? "text-red-400 bg-red-400/10 border-red-400/20"
                : "text-green-400 bg-green-400/10 border-green-400/20"
            }`}
          >
            <span>{trend.direction === "up" ? "↗" : "↘"}</span>
            <span>
              {trend.direction === "up" ? "+" : "-"}
              {trend.percentage}%
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-3xl font-bold text-white">
            ${currentAmount.toLocaleString()}
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Budget</span>
            <span className="text-gray-400">
              ${budgetAmount.toLocaleString()}
            </span>
          </div>

          <div className="w-full  rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${gradient} transition-all duration-500 relative`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1">
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-lg font-bold text-white animate-pulse">
                ${remaining.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">
                Remaining
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
