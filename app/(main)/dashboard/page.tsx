import React from "react";
import ExpenseStats from "@/features/dashboard/components/expensestats";
import RecentExpenses from "@/features/dashboard/recentexpense";
import FriendsActivity from "@/features/dashboard/components/friendsactivity";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

type Props = {};

export default async function page({}: Props) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  return (
    <div className="">
      {/* header section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <h2 className="text-3xl font-bold text-gradient">
              Welcome Sankalpa
            </h2>
            <span className="text-3xl">👋</span>
          </div>
          <p className="mt-1 text-muted-foreground">
            Track your spending, build habits, save money
          </p>
        </div>
        <Button className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
          <Plus size={16} className="mr-2" /> Add Expense
        </Button>
      </div>
      {/* dashbaord stats */}
      <ExpenseStats />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <RecentExpenses />
        </div>
        <div className="md:col-span-1">
          <FriendsActivity />
        </div>
      </div>
    </div>
  );
}
