"use client";
import { useBudgetStore } from "@/lib/store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export function MonthSelector() {
  const { selectedMonth, updateSelectedMonth } = useBudgetStore(
    (state) => state
  );

  const [currentSelectedMonth, setCurrentSelectedMonth] = useState(
    parseInt(selectedMonth.split("-")[1])
  );

  const [isPrevDisable, setIsPrevDisable] = useState(false);
  const [isNextDisable, setIsNextDisable] = useState(true);

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

  useEffect(() => {
    const month = parseInt(selectedMonth.split("-")[1]);
    setCurrentSelectedMonth(month);

    setIsPrevDisable(month <= 1);
    setIsNextDisable(month >= new Date().getMonth() + 1);
  }, [selectedMonth]);

  const handlePrevMonth = () => {
    const newMonth = currentSelectedMonth > 1 ? currentSelectedMonth - 1 : 1;
    const newMonthString = `2025-${newMonth.toString().padStart(2, "0")}-01`;

    setCurrentSelectedMonth(newMonth);
    updateSelectedMonth(newMonthString);

    setIsPrevDisable(newMonth <= 1);
    setIsNextDisable(false);
  };

  const handleNextMonth = () => {
    const newMonth = currentSelectedMonth < 12 ? currentSelectedMonth + 1 : 12;
    const newMonthString = `2025-${newMonth.toString().padStart(2, "0")}-01`;

    console.log("📅 Next month clicked:", newMonthString);

    setCurrentSelectedMonth(newMonth);
    updateSelectedMonth(newMonthString);

    // Update button states
    setIsNextDisable(newMonth >= new Date().getMonth() + 1);
    setIsPrevDisable(false);
  };

  return (
    <div className="inline-flex items-center">
      <button
        onClick={handlePrevMonth}
        disabled={isPrevDisable}
        className="p-2 hover:bg-muted rounded-full bg-muted-foreground/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-3 h-3" />
      </button>
      <div className="px-3 py-2 text-center min-w-[120px]">
        <div className="text-md font-semibold text-foreground">
          {months[currentSelectedMonth - 1]}
        </div>
        <div className="text-xs text-muted-foreground">
          {selectedMonth.split("-")[0]}
        </div>
      </div>
      <button
        onClick={handleNextMonth}
        disabled={isNextDisable}
        className="p-2 hover:bg-muted rounded-full bg-muted-foreground/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}
