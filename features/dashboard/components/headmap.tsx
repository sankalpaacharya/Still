import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, TrendingUp, IndianRupee } from "lucide-react";
import { startOfMonth, getDay, getDaysInMonth, format } from "date-fns";
import { getTransactionOfMonth } from "../actions";
import HeatMapSheet from "./heatmap-sheet";

export async function SpendingHeatmap() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIndex = today.getMonth();
  const monthStartDay = getDay(startOfMonth(today));
  const daysInMonth = getDaysInMonth(today);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const all = await getTransactionOfMonth();
  console.log(all);

  const totalSpending = Object.values(all).reduce(
    (sum, amount) => sum + amount,
    0,
  );
  const currentMonth = format(today, "MMMM yyyy");

  return (
    <Card className="w-full max-w-[720px] shadow-lg  backdrop-blur bg-card/50">
      <CardHeader className="pb-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
              <div className="p-2 rounded-full bg-primary/10">
                <Calendar size={20} className="text-primary" />
              </div>
              Spending Heatmap
            </CardTitle>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track your daily spending patterns for {currentMonth}
            </p>
          </div>

          {/* Month Summary */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/50">
              <IndianRupee size={16} className="text-green-600" />
              <span className="font-semibold">{totalSpending.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/50">
              <TrendingUp size={16} className="text-blue-600" />
              <span className="font-semibold">
                {Object.keys(all).length} days
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-6">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3">
          {days.map((day) => (
            <div
              key={day}
              className="text-center text-xs sm:text-sm font-bold text-muted-foreground py-2 sm:py-3"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 1)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {Array.from({ length: daysInMonth + monthStartDay }).map(
            (_, index) => {
              const dayNumber = index - monthStartDay + 1;
              const amount = all[dayNumber] || 0;
              const isToday = dayNumber === today.getDate();
              const hasSpending = amount > 0;

              return index < monthStartDay ? (
                <div key={index} className="aspect-square" />
              ) : (
                <HeatMapSheet
                  key={index}
                  date={format(
                    new Date(currentYear, currentMonthIndex, dayNumber),
                    "yyyy-MM-dd HH:mm:ss.SSSxxx",
                  )}
                  amount={amount}
                >
                  <div
                    className={`
                  aspect-square border-2 flex items-center justify-center 
                  font-semibold rounded-xl transition-all duration-300 ease-out
                  hover:scale-105 hover:shadow-lg cursor-pointer
                  flex-col text-center relative group
                  ${
                    isToday
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50"
                  }
                  ${
                    hasSpending
                      ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30"
                      : "bg-muted/30 hover:bg-muted/50"
                  }
                `}
                  >
                    <span
                      className={`
                  text-xs sm:text-sm font-bold mb-1 
                  ${isToday ? "text-primary" : "text-foreground"}
                `}
                    >
                      {dayNumber}
                    </span>

                    <div className="flex items-center justify-center min-h-[20px]">
                      {amount <= 0 ? (
                        <span className="text-base sm:text-lg opacity-60 group-hover:opacity-100 transition-opacity"></span>
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                          ₹{amount}
                        </span>
                      )}
                    </div>
                  </div>
                </HeatMapSheet>
              );
            },
          )}
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <div className="w-4 h-4 rounded border-2 border-border bg-muted/30" />
            <span>No spending</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <div className="w-4 h-4 rounded border-2 border-border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20" />
            <span>Has spending</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <div className="w-4 h-4 rounded border-2 border-primary bg-primary/10 relative">
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
            </div>
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SpendingHeatmap;
