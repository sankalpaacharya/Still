"use client";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

type Expense = {
  id: number;
  description: string;
  amount: number;
  isReviewed: boolean;
};

const initialExpenses: Expense[] = [
  { id: 1, description: "Late night snacks", amount: 15, isReviewed: false },
  { id: 2, description: "Monthly Netflix", amount: 12, isReviewed: false },
  { id: 3, description: "Uber ride", amount: 8, isReviewed: false },
];

export default function ExpenseRoastChat() {
  const [expenses, setExpenses] = useState(initialExpenses);

  const toggleReviewed = (id: number) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isReviewed: !e.isReviewed } : e))
    );
  };

  const getRoastMessage = (desc: string, amt: number) => {
    const lower = desc.toLowerCase();
    if (lower.includes("snack"))
      return `Bruh, another snack binge? Dropped $${amt.toFixed(
        2
      )} like it’s nothing 🍟🔥`;
    if (lower.includes("netflix"))
      return `Netflix and broke? $${amt.toFixed(2)} well wasted, no cap 📺💸`;
    if (lower.includes("uber"))
      return `Yo, walked for free but nah, $${amt.toFixed(
        2
      )} Uber flex? Lazy much? 🚶‍♂️💀`;
    return `$${amt.toFixed(2)} gone? Chill, but don’t make it a habit 🔥`;
  };

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      className="p-5 space-y-5 bg-glass/40 rounded-3xl max-w-md mx-auto flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 items-center">
          <span className="p-2 bg-glass/40 rounded-full">
            <ArrowLeft size={20} />
          </span>
          <p className="text-lg font-extrabold text-gray-200">Sanku’s Roasts</p>
        </div>
        <span className="p-2 bg-glass/40 rounded-full cursor-pointer">
          <FiPlus size={20} />
        </span>
      </div>

      {expenses.map(({ id, description, amount, isReviewed }) => (
        <motion.div
          key={id}
          onClick={() => toggleReviewed(id)}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.3 }}
          className={`relative cursor-pointer rounded-2xl p-5 shadow-xl max-w-full text-gray-300 ${
            isReviewed
              ? "bg-green-900/60 border border-green-500"
              : "bg-glass/40 backdrop-blur-lg border border-gray-700"
          } hover:brightness-110`}
        >
          <p className="font-semibold text-lg select-none pointer-events-none">
            {getRoastMessage(description, amount)}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
