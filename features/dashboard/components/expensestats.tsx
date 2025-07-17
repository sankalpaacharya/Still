import React from "react";
import { Card } from "@/components/ui/card";
import { CreditCard, Flame, Landmark, HandCoins } from "lucide-react";
import { getUserAccounts } from "@/features/account/actions";
import { getTotalSpendingThisMonth } from "../actions";
import { cn } from "@/lib/utils";
import { getTotalAmountByType } from "@/features/cashflow/actions";

type Props = {};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  className?: string;
}

export default async function ExpenseStats() {
  const accounts = await getUserAccounts();
  const totalSpending = await getTotalSpendingThisMonth();
  const totalIncome = await getTotalAmountByType("income");
  const totalExpense = await getTotalAmountByType("expense");
  const total = accounts.reduce((sum, acc) => sum + acc.amount, 0);
  const todayDate = new Date().getDate();
  const avgDailySpending = parseFloat((totalSpending / todayDate).toFixed(2));

  return (
    <div className="mb-6 animate-fade-in">
      {/* Mobile: 2x2 grid with compact cards */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        <CompactStatCard
          title="💸 Total Balance"
          value={`$${total}`}
          icon={<CreditCard className="w-4 h-4" />}
        />
        <CompactStatCard
          title="📈 Daily Average Spending"
          value={`$${avgDailySpending}`}
          icon={<Flame className="w-4 h-4" />}
        />
        <CompactStatCard
          title="Income"
          value={`$${totalIncome.amount}`}
          icon={<Landmark className="w-4 h-4" />}
        />
        <CompactStatCard
          title="Expense"
          value={`$${totalExpense.amount}`}
          icon={<HandCoins className="w-4 h-4" />}
        />
      </div>

      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="💸 Total Balance"
          value={`$${total}`}
          change="12.3%"
          isPositive={false}
          icon={<CreditCard />}
        />
        <StatCard
          title="📈 Daily Average Spending"
          value={`$${avgDailySpending}`}
          isPositive={false}
          change="12.3%"
          icon={<Flame />}
        />
        <StatCard
          title="Income"
          value={`$${totalIncome.amount}`}
          change="12.3%"
          isPositive={false}
          icon={<Landmark />}
        />
        <StatCard
          title="Expense"
          value={`$${totalExpense.amount}`}
          change="12.3%"
          isPositive={false}
          icon={<HandCoins />}
        />
      </div>
    </div>
  );
}

// Compact version for mobile
const CompactStatCard = ({
  title,
  value,
  icon,
  className,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}) => {
  return (
    <Card
      className={cn(
        "p-3 bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card rounded-xl",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-400 truncate">{title}</p>
          <h3 className="text-lg font-bold mt-0.5 truncate">{value}</h3>
        </div>
        <div className="p-2 rounded-full bg-white/10 ml-2 flex-shrink-0">
          {icon}
        </div>
      </div>
    </Card>
  );
};

// Original version for desktop
const StatCard = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  className,
}: StatCardProps) => {
  return (
    <Card
      className={cn(
        "p-4",
        className,
        "p-4 bg-gradient-to-t from-primary/5 to-card shadow-xs dark:bg-card rounded-xl",
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div
            className={cn(
              "text-xs flex items-center mt-1",
              isPositive ? "text-green-500" : "text-red-500",
            )}
          ></div>
        </div>
        <div className="p-3 rounded-full bg-white/10">{icon}</div>
      </div>
    </Card>
  );
};
