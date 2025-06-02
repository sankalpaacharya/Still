import React from "react";
import ExpenseStats from "@/features/dashboard/components/expensestats";
import RecentExpenses from "@/features/dashboard/components/recentexpense";
import FriendsActivity from "@/features/dashboard/components/friendsactivity";
import { createClient } from "@/utils/supabase/server";
import AddExpenseModalButton from "@/features/dashboard/components/addexpensebutton";

export default async function page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <h2 className="text-3xl font-bold text-gradient capitalize">
              Welcome {user?.user_metadata.full_name.split(" ")[0]}
            </h2>
            <span className="text-3xl">👋</span>
          </div>
          <p className="mt-1 text-muted-foreground">
            Track your spending, build habits, save money
          </p>
        </div>
        <AddExpenseModalButton />
      </div>
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
