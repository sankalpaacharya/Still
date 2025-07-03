type TransactionType = "income" | "expense";

interface TransactionItemProps {
  emoji: string;
  title: string;
  category: string;
  timeAgo: string;
  amount: number;
  type: TransactionType;
}

export const TransactionItem = ({
  emoji,
  title,
  category,
  timeAgo,
  amount,
  type,
}: TransactionItemProps) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-muted/30 last:border-none">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{emoji}</div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">
            {category} • {timeAgo}
          </p>
        </div>
      </div>
      <div
        className={`text-sm font-semibold flex items-center gap-1 ${
          type === "income" ? "text-green-500" : "text-red-500"
        }`}
      >
        {type === "income" ? "↑" : "↓"}
        {type === "income"
          ? `+₹${amount.toLocaleString()}`
          : `-₹${amount.toLocaleString()}`}
      </div>
    </div>
  );
};
