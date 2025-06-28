import React from "react";
import { Card } from "@/components/ui/card";
import { CreditCard, Flame, Landmark, HandCoins } from "lucide-react";
import { getUserAccounts } from "@/features/account/actions";
import { cn } from "@/lib/utils";

type Props = {};
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  className?: string;
}
export default async function ExpenseStats({}: Props) {
  const accounts = await getUserAccounts();
  const total = accounts.reduce((sum, acc) => sum + acc.amount, 0);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
      <StatCard
        title="💸 Total Balance"
        value={`₹${total}`}
        change="12.3%"
        isPositive={false}
        icon={<CreditCard />}
      />
      <StatCard
        title="🔥 Current Streak"
        value="10 days"
        change="12.3%"
        isPositive={false}
        icon={<Flame />}
      />
      <StatCard
        title="Budget Left"
        value="₹2340.23"
        change="12.3%"
        isPositive={false}
        icon={<Landmark />}
      />
      <StatCard
        title="💰 Saved Money"
        value="₹1,240.56"
        change="12.3%"
        isPositive={false}
        icon={<HandCoins />}
      />
    </div>
  );
}

const StatCard = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  className,
}: StatCardProps) => {
  return (
    <Card className={cn("p-4", className, "backdrop-blur-2xl")}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div
            className={cn(
              "text-xs flex items-center mt-1",
              isPositive ? "text-green-500" : "text-red-500"
            )}
          ></div>
        </div>
        <div className="p-3 rounded-full bg-white/10">{icon}</div>
      </div>
    </Card>
  );
};
