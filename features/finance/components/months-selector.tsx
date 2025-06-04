"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function MonthSelector() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    setSelectedMonth((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => (prev < 11 ? prev + 1 : 11));
  };

  return (
    <div className="inline-flex items-center">
      <button
        onClick={handlePrevMonth}
        disabled={selectedMonth === 0}
        className="p-2 hover:bg-muted rounded-full bg-muted-foreground/10 transition-all cursor-pointer"
      >
        <ChevronLeft className="w-3 h-3" />
      </button>

      <div className="px-3 py-2 text-center min-w-[120px]">
        <div className="text-md font-semibold text-foreground">
          {months[selectedMonth]}
        </div>
        <div className="text-xs text-muted-foreground">{currentYear}</div>
      </div>

      <button
        onClick={handleNextMonth}
        disabled={selectedMonth === 11}
        className="p-2 hover:bg-muted rounded-full bg-muted-foreground/10 transition-all cursor-pointer"
      >
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}
