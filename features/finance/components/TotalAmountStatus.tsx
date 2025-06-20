"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type TotalAmountStatusProps = {
  amount: number;
  onAssign?: () => void;
  onRequest?: () => void;
};

export function BalanceCard({ amount, onAssign }: TotalAmountStatusProps) {
  return (
    <div className="relative">
      <div className=" backdrop-blur-sm rounded-2xl p-4 w-72 shadow-lg border border-slate-700/50 transition-all duration-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-slate-400 text-xs font-medium">Your Balance</p>
            <h1 className="text-white text-3xl font-bold mt-1">
              ₹{amount.toFixed(2)}
            </h1>
          </div>

          <Button
            onClick={onAssign}
            size="icon"
            className="bg-green-500 hover:bg-green-400 w-10 h-10 rounded-full transition-all duration-200 shadow-md"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>
    </div>
  );
}
