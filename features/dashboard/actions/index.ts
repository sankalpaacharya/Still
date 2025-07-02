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

export async function mostSpentCategory() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    return [];
  }
  const { data, error } = await supabase
    .from("transactions")
    .select("id,category,category_id,amount")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .limit(5);
  const expenses: any = {};
  data?.forEach((expense) => {
    if (expenses[expense.category] != undefined) {
      expenses[expense.category] += expense.amount;
    }
    expenses[expense.category] = expense.amount;
  });
  return expenses;
}
