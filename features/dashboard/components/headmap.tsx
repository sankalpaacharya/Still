import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { startOfMonth, getDay, getDaysInMonth } from "date-fns";
import { getTransactionOfMonth } from "../actions";

export async function SpendingHeatmap() {
  const today = new Date();
  const monthStartDay = getDay(startOfMonth(today));
  const daysInMonth = getDaysInMonth(today);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const all = await getTransactionOfMonth();

  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar size={20} />
          Spendings
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Track your daily spending patterns
        </p>
      </CardHeader>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 px-6 pb-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <CardContent className="grid grid-cols-7 gap-2 pt-0">
        {Array.from({ length: daysInMonth + monthStartDay }).map((_, index) => {
          const dayNumber = index - monthStartDay + 1;
          const amount = all[dayNumber] || 0;
          const isToday = dayNumber === today.getDate();
          const hasSpending = amount > 0;

          return index < monthStartDay ? (
            <div key={index} className="aspect-square" />
          ) : (
            <div
              key={index}
              className={`
                aspect-square border border-border flex items-center justify-center 
                font-semibold rounded-lg transition-all duration-200 
                hover:bg-muted/50 cursor-pointer hover:scale-105 hover:shadow-md
                flex-col text-base
              `}
            >
              <span className="text-sm font-bold mb-1">{dayNumber}</span>
              <span
                className={`font-medium ${hasSpending ? "text-blue-600 dark:text-blue-400 text-xl" : "text-sm"}`}
              >
                {amount <= 0 ? "🥚" : `$${amount}`}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default SpendingHeatmap;
