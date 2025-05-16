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
  cardColor,
}: AccountProps) {
  // Different background gradients based on account type
  const getCardBackground = () => {
    switch (accountType.toLowerCase()) {
      case "savings":
        return "from-blue-500 to-blue-700";
      case "credit":
        return "from-purple-500 to-purple-700";
      case "checking":
        return "from-green-500 to-green-700";
      case "investment":
        return "from-amber-500 to-amber-700";
      case "loan":
        return "from-red-500 to-red-700";
      default:
        return cardColor || "from-gray-600 to-gray-800";
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
        "w-full max-w-md rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl",
        "bg-gradient-to-br backdrop-filter backdrop-blur-sm",
        getCardBackground()
      )}
    >
      <div className="relative h-44 p-5 flex flex-col justify-between overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-40" />

        {/* Glass-like shine effect */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent" />

        {/* Content container with z-index to appear above effects */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Top section */}
          <div className="flex justify-between items-start">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5">
              <p className="text-xs font-medium text-white">FixYourSpend</p>
            </div>
            <div className="flex items-center">
              <div className="bg-white/10 backdrop-blur-md rounded-full p-1.5">
                <span className="text-sm">{getAccountTypeIcon()}</span>
              </div>
            </div>
          </div>

          {/* Middle section */}
          <div className="mt-2">
            <p className="text-xs font-medium uppercase tracking-wide text-white/70">
              Balance
            </p>
            <p className="font-bold text-white text-2xl mt-1">{balance}</p>
          </div>

          {/* Bottom section */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/70">
                Name
              </p>
              <p className="font-medium text-white">{name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white/10 backdrop-blur-md rounded-full p-2">
                <span className="text-lg">{getAccountTypeIcon()}</span>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-white/70">
                  Type
                </p>
                <p className="font-medium text-white">{accountType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
