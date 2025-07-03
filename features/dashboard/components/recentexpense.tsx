import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { TransactionItem } from "./transaction-items";
import { ChevronRight } from "lucide-react";

export const TransactionCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Recent Transactions
        </CardTitle>
        <Link
          href="/transactions"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View All <ChevronRight size={14} />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        <TransactionItem
          emoji="🍕"
          title="Swiggy Food Delivery"
          category="Food & Dining"
          timeAgo="2 hours ago"
          amount={485}
          type="expense"
        />
        <TransactionItem
          emoji="🚗"
          title="Uber Ride"
          category="Transportation"
          timeAgo="5 hours ago"
          amount={120}
          type="expense"
        />
        <TransactionItem
          emoji="💰"
          title="Salary Bonus"
          category="Income"
          timeAgo="1 day ago"
          amount={5000}
          type="income"
        />
        <TransactionItem
          emoji="📦"
          title="Amazon Purchase"
          category="Shopping"
          timeAgo="2 days ago"
          amount={1250}
          type="expense"
        />
        <TransactionItem
          emoji="🎬"
          title="Netflix Subscription"
          category="Entertainment"
          timeAgo="3 days ago"
          amount={199}
          type="expense"
        />
      </CardContent>
    </Card>
  );
};
