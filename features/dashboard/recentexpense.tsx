"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, Edit, Trash2 } from "lucide-react";

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

const initialExpenses: Expense[] = [
  {
    id: 1,
    description: "Coffee at Starbucks",
    amount: 4.95,
    date: "2025-05-10",
    category: "Food",
  },
  {
    id: 2,
    description: "Grocery shopping",
    amount: 65.32,
    date: "2025-05-09",
    category: "Groceries",
  },
  {
    id: 3,
    description: "Movie tickets",
    amount: 28.5,
    date: "2025-05-08",
    category: "Entertainment",
  },
  {
    id: 4,
    description: "Uber ride",
    amount: 12.75,
    date: "2025-05-07",
    category: "Transport",
  },
  {
    id: 5,
    description: "Monthly Netflix",
    amount: 14.99,
    date: "2025-05-05",
    category: "Subscriptions",
  },
];

export default function RecentExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  // Map categories to emojis
  const categoryEmoji = (category: string): string => {
    switch (category) {
      case "Food":
        return "🍔";
      case "Groceries":
        return "🛒";
      case "Entertainment":
        return "🎬";
      case "Transport":
        return "🚗";
      case "Subscriptions":
        return "📺";
      case "Shopping":
        return "🛍️";
      case "Bills":
        return "📄";
      case "Health":
        return "🏥";
      case "Travel":
        return "✈️";
      default:
        return "💸";
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-md font-medium">
          💰 Recent Expenses
        </CardTitle>
        <Button variant="outline" className="text-xs h-8">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  {categoryEmoji(expense.category)}
                </div>
                <div>
                  <div className="font-medium">{expense.description}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{formatDate(expense.date)}</span>
                    <span className="mx-1">•</span>
                    <span>
                      {categoryEmoji(expense.category)} {expense.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">
                  ${expense.amount.toFixed(2)}
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(expense.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
