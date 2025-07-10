import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { startOfMonth, getDay, getDaysInMonth } from "date-fns";

const SpendingHeatmap = () => {
  const today = new Date();
  const monthStartDay = getDay(startOfMonth(today));
  const daysInMonth = getDaysInMonth(today);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar size={18} />
          Spendings
        </CardTitle>
      </CardHeader>

      <div className="grid grid-cols-7 gap-2 px-4 mt-10">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <CardContent className="grid grid-cols-7 gap-2">
        {Array.from({ length: daysInMonth + monthStartDay }).map((_, index) => {
          const dayNumber = index - monthStartDay + 1;

          return index < monthStartDay ? (
            <div key={index} />
          ) : (
            <div
              key={index}
              className="aspect-square border flex items-center justify-center text-sm font-semibold rounded-lg"
            >
              {dayNumber}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SpendingHeatmap;
