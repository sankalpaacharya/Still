import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  ShoppingCart,
  Car,
  Home,
  Coffee,
  Gamepad2,
} from "lucide-react";

const TopSpentCategories = ({ data = [] }) => {
  // Mock data for demonstration - replace with your actual data
  const mockData = [
    {
      category: "Food & Dining",
      amount: 850.25,
      percentage: 45,
      icon: "coffee",
    },
    { category: "Transportation", amount: 620.5, percentage: 35, icon: "car" },
    { category: "Shopping", amount: 485.75, percentage: 25, icon: "shopping" },
  ];

  const categories = data.length > 0 ? data : mockData;

  const getIcon = (iconType: any) => {
    const iconProps = { size: 16, className: "text-muted-foreground" };
    switch (iconType) {
      case "coffee":
        return <Coffee {...iconProps} />;
      case "car":
        return <Car {...iconProps} />;
      case "shopping":
        return <ShoppingCart {...iconProps} />;
      case "home":
        return <Home {...iconProps} />;
      case "gaming":
        return <Gamepad2 {...iconProps} />;
      default:
        return <TrendingUp {...iconProps} />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp size={16} />
          Top Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.slice(0, 3).map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
              {getIcon(item.icon)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">
                  {item.category}
                </p>
                <Badge variant="secondary" className="text-xs">
                  ₹{item.amount.toLocaleString()}
                </Badge>
              </div>
              <Progress value={item.percentage} className="h-1" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopSpentCategories;
