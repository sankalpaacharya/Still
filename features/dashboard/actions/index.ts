"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type Expense = {
  categoryGroup: string;
  category: string;
  description?: string;
  amount: number;
  date?: string;
  userId?: string;
  type: string;
  categoryId: string;
  accountID: string;
};

export async function addExpenseAction(data: Expense) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: true, message: "User not found" };
  }

  // Fetch account
  const { data: accountData, error: accountError } = await supabase
    .from("accounts")
    .select("amount")
    .eq("id", data.accountID)
    .single();

  if (accountError || !accountData) {
    return { error: true, message: "Account not found" };
  }

  if (data.type === "expense" && accountData.amount < data.amount) {
    return {
      error: true,
      message: "Insufficient balance in the selected account",
    };
  }

  const { error: insertError } = await supabase.from("transactions").insert({
    user_id: user.id,
    category_group: data.categoryGroup,
    category: data.category,
    amount: data.amount,
    description: data.description,
    category_id: data.categoryId,
    account_id: data.accountID,
    type: data.type,
  });

  if (insertError) {
    return { error: true, message: insertError.message };
  }

  const updatedAmount =
    data.type === "income"
      ? accountData.amount + data.amount
      : accountData.amount - data.amount;

  const { error: updateError } = await supabase
    .from("accounts")
    .update({
      amount: updatedAmount,
    })
    .eq("id", data.accountID);

  if (updateError) {
    return {
      error: true,
      message: `${
        data.type === "income"
          ? "Income added but failed to update account balance"
          : "Expense added but failed to update account balance"
      }`,
    };
  }

  revalidatePath("/dashboard");
  return {
    error: false,
    message:
      data.type === "income"
        ? "Income added successfully"
        : "Expense added successfully",
  };
}

export async function mostSpentCategoryWithBudget() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) return [];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const monthKey = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-01`;

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("category, category_id, amount")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("created_at", startOfMonth.toISOString())
    .lte("created_at", endOfMonth.toISOString());
  if (error || !transactions) return [];

  const grouped: Record<
    string,
    { category: string; category_id: string; amount: number }
  > = {};

  for (const tx of transactions) {
    const id = tx.category_id;
    if (!grouped[id]) {
      grouped[id] = {
        category: tx.category,
        category_id: tx.category_id,
        amount: 0,
      };
    }
    grouped[id].amount += tx.amount;
  }

  const top5 = Object.values(grouped)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const categoryIds = top5.map((c) => c.category_id);
  console.log("categoryIDS", categoryIds);
  const { data: monthsData } = await supabase
    .from("category_months")
    .select("category_id, assign")
    .in("category_id", categoryIds)
    .eq("month", monthKey);
  console.log("month key", monthKey);
  const assignMap: Record<string, number> = {};
  for (const item of monthsData || []) {
    assignMap[item.category_id] = item.assign ?? 0;
  }

  return top5.map((item) => ({
    ...item,
    assigned: assignMap[item.category_id] || 0,
  }));
}

export async function getRecentTransactions() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) return [];

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .limit(5);
  if (error) return [];

  return data;
}

export async function getTotalSpendingThisMonth() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) return 0;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { data, error } = await supabase
    .from("transactions")
    .select("amount")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("created_at", startOfMonth.toISOString())
    .lte("created_at", now.toISOString());

  if (error || !data) return 0;

  const total = data.reduce((sum, item) => sum + item.amount, 0);
  return total;
}
