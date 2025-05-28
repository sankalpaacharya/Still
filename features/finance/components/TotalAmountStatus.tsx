"use client";

import { Button } from "@/components/ui/button";

type TotalAmountStatusProps = {
  amount: number;
  onAssign?: () => void;
};

export function TotalAmountStatus({
  amount,
  onAssign,
}: TotalAmountStatusProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="p-4 bg-green-700 rounded-md shadow-2xl flex w-72 justify-between">
        <div>
          <h2 className="text-3xl font-bold">₹{amount}</h2>
          <p className="text-sm">Ready Assign</p>
        </div>
        <Button className="shadow-xl cursor-pointer" onClick={onAssign}>
          Assign
        </Button>
      </div>
    </div>
  );
}
