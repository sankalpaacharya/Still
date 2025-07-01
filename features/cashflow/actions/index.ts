"use server";
import { createClient } from "@/utils/supabase/server";
import { Expense } from "../components/columns";
import { revalidatePath } from "next/cache";

export type GroupExpense = Record<string, Expense[]>;

export async function getExpenses(): Promise<GroupExpense | {}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: true, message: "user not found" };

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: true })
    .eq("user_id", user.id);
  if (!data) return { error: true, message: error.message };

  const expenseData: any = {};

  for (let expense of data) {
    const group = expense["category_group"];
    if (expense["category_group"] in expenseData) {
      expenseData[group].push(expense);
    } else {
      expenseData[group] = [expense];
    }
  }
  return expenseData;
}

export async function updateExpenseAction(data: any) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: true, message: "User not found" };

  // Fetch original expense
  const { data: oldExpense, error: fetchError } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", data.id)
    .single();

  if (fetchError || !oldExpense) {
    return { error: true, message: "Original expense not found" };
  }

  const amountChanged = data.amount !== oldExpense.amount;
  const accountChanged = data.accountID !== oldExpense.account_id;

  // If amount or account changed, we need to update account balances
  if (amountChanged || accountChanged) {
    // First, revert the old expense from the old account
    const { data: oldAccount, error: oldAccountError } = await supabase
      .from("accounts")
      .select("amount")
      .eq("id", oldExpense.account_id)
      .single();

    if (oldAccountError || !oldAccount) {
      return { error: true, message: "Failed to fetch old account details" };
    }

    // Restore the old account balance (add back the old expense amount)
    const { error: revertError } = await supabase
      .from("accounts")
      .update({
        amount: oldAccount.amount + oldExpense.amount,
      })
      .eq("id", oldExpense.account_id);

    if (revertError) {
      return {
        error: true,
        message: `Failed to revert old account balance: ${revertError.message}`,
      };
    }

    // Now fetch the new account and check if it has sufficient balance
    const { data: newAccount, error: newAccountError } = await supabase
      .from("accounts")
      .select("amount")
      .eq("id", data.accountID)
      .single();

    if (newAccountError || !newAccount) {
      // If we can't fetch new account, we need to revert the old account change
      await supabase
        .from("accounts")
        .update({
          amount: oldAccount.amount, // Revert back to original
        })
        .eq("id", oldExpense.account_id);

      return { error: true, message: "Failed to fetch new account details" };
    }

    const newBalance = newAccount.amount - data.amount;

    if (newBalance < 0) {
      // Revert the old account balance change before returning error
      await supabase
        .from("accounts")
        .update({
          amount: oldAccount.amount, // Revert back to original
        })
        .eq("id", oldExpense.account_id);

      return {
        error: true,
        message: "Insufficient balance in selected account",
      };
    }

    // Update the new account balance
    const { error: updateNewAccountError } = await supabase
      .from("accounts")
      .update({
        amount: newBalance,
      })
      .eq("id", data.accountID);

    if (updateNewAccountError) {
      // Revert the old account balance change
      await supabase
        .from("accounts")
        .update({
          amount: oldAccount.amount, // Revert back to original
        })
        .eq("id", oldExpense.account_id);

      return {
        error: true,
        message: `Failed to update new account balance: ${updateNewAccountError.message}`,
      };
    }
  }

  // Finally, update the expense
  const { error: updateExpenseError } = await supabase
    .from("expenses")
    .update({
      category_id: data.categoryID,
      category: data.category,
      amount: data.amount,
      description: data.description,
      account_id: data.accountID,
    })
    .eq("id", data.id);

  if (updateExpenseError) {
    return {
      error: true,
      message: `Failed to update expense: ${updateExpenseError.message}`,
    };
  }
  revalidatePath("cashflow");
  return { error: false, message: "Expense updated successfully" };
}
