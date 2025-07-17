import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { TransactionItem } from "./transaction-items";
import { ChevronRight } from "lucide-react";
import { getRecentTransactions } from "../actions";
import { getCategoryEmoji } from "@/lib/utils";
import { timeSince } from "@/lib/utils";

export const TransactionCard = async () => {
  const transactions = await getRecentTransactions();
  console.log("transactions", transactions);
  return (
    <Card className="bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Recent Transactions
        </CardTitle>
        <Link
          href="/cashflow"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View All <ChevronRight size={14} />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {transactions.map((tx) => (
          <TransactionItem
            key={tx.id}
            emoji={getCategoryEmoji(tx.category)}
            title={tx.description}
            category={tx.category}
            timeAgo={timeSince(tx.created_at)}
            amount={tx.amount}
            type={tx.type}
          />
        ))}
      </CardContent>
    </Card>
  );
};
