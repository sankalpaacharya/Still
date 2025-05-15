import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface Friend {
  id: number;
  name: string;
  avatar: string;
  streak: number;
  lastPurchase: string;
  amount: number;
}

const friends: Friend[] = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "A",
    streak: 18,
    lastPurchase: "Groceries",
    amount: 42.99,
  },
  {
    id: 2,
    name: "Sam Wilson",
    avatar: "S",
    streak: 15,
    lastPurchase: "Coffee",
    amount: 5.25,
  },
  {
    id: 3,
    name: "Taylor Kim",
    avatar: "T",
    streak: 30,
    lastPurchase: "Gym",
    amount: 25.0,
  },
  {
    id: 4,
    name: "Jordan Lee",
    avatar: "J",
    streak: 8,
    lastPurchase: "Books",
    amount: 32.5,
  },
];

export default function FriendsActivity() {
  const categoryEmoji = (category: string): string => {
    switch (category) {
      case "Groceries":
        return "🛒";
      case "Coffee":
        return "☕";
      case "Gym":
        return "💪";
      case "Books":
        return "📚";
      case "Transport":
        return "🚗";
      case "Food":
        return "🍔";
      case "Shopping":
        return "🛍️";
      default:
        return "💵";
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-md font-medium">
          👥 Friends Activity
        </CardTitle>
        <Button variant="outline" size="sm" className="text-xs h-8">
          <Users size={14} className="mr-1" /> Add Friends
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {friend.avatar}
                </div>
                <div>
                  <div className="font-medium">{friend.name}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <span>
                      {categoryEmoji(friend.lastPurchase)} {friend.lastPurchase}
                    </span>
                    <span className="mx-1">•</span>
                    <span>${friend.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs px-2 py-1 bg-white/10 rounded-full flex items-center">
                  <span className="text-yellow-400 mr-1">🔥</span>
                  <span>{friend.streak} day streak</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
