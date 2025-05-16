import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface AccountProps {
  name: string;
  balance: number;
  accountType: string;
  cardColor?: string;
}

export function AccountCard({
  name,
  balance,
  accountType,
  cardColor = "from-purple-500 to-indigo-800",
}: AccountProps) {
  const getCardBackground = () => {
    switch (accountType.toLowerCase()) {
      case "savings":
        return "from-blue-500 via-blue-800 to-blue-900";
      case "credit":
        return "from-purple-600 via-purple-800 to-indigo-900";
      case "checking":
        return "from-green-600 via-green-800 to-green-900";
      case "investment":
        return "from-amber-600 via-amber-800 to-orange-900";
      case "loan":
        return "from-red-600 via-red-800 to-red-900";
      default:
        return cardColor;
    }
  };

  const getAccountTypeIcon = () => {
    switch (accountType.toLowerCase()) {
      case "savings":
        return "💰";
      case "credit":
        return "💳";
      case "checking":
        return "🏦";
      case "investment":
        return "📈";
      case "loan":
        return "💸";
      default:
        return "💵";
    }
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden w-full max-w-md rounded-xl backdrop-blur-sm border border-white/20 shadow-xl transition-transform duration-300 hover:scale-105 cursor-pointer group",
        "bg-gradient-to-br",
        getCardBackground()
      )}
    >
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col h-56 p-6 justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-white/70">ACCOUNT TYPE</p>
            <div className="flex items-center mt-1">
              <span className="mr-2 text-xl">{getAccountTypeIcon()}</span>
              <h3 className="font-semibold text-white">{accountType}</h3>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1">
              <p className="text-xs font-semibold text-white">FixYourSpend</p>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="mb-6">
            <p className="text-xs font-medium text-white/70">ACCOUNT NAME</p>
            <p className="font-semibold text-white text-lg">{name}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-white/70">BALANCE</p>
            <p className="font-bold text-white text-xl">₹{balance}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
