"use server";
import { createClient } from "@/utils/supabase/server";
import { Expense } from "../components/columns";
import { revalidatePath } from "next/cache";
import { getImageUrlForTransaction } from "@/features/dashboard/actions";

export type GroupExpense = Record<string, Expense[]>;

export async function getExpenses(): Promise<GroupExpense | {}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: true, message: "user not found" };

  const { data, error } = await supabase
    .from("transaction")
    .select("*")
    .order("created_at", { ascending: true })
    .eq("user_id", user.id);
  if (!data) return { error: true, message: error.message };

  const { data: categories } = await supabase
    .from("category")
    .select("id, name, icon, budget, type")
    .eq("user_id", user.id);
  if (!categories)
    return { error: true, message: "Failed to fetch categories" };

  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

  const expenseData: any = {};

  const imageUrls = await Promise.all(
    data.map((expense) => getImageUrlForTransaction(expense.id, user.id)),
  );

  for (let i = 0; i < data.length; i++) {
    const expense = data[i];
    const group = expense["category_id"];
    const categoryInfo = categoryMap.get(group);

    expense.category = categoryInfo?.name || "Uncategorized";
    expense.icon = categoryInfo?.icon || "default-icon";
    expense.budget = categoryInfo?.budget || 0;
    expense.type = categoryInfo?.type || "expense";
    expense.imageUrl = imageUrls[i];

    if (expense.category in expenseData) {
      expenseData[expense.category].push(expense);
    } else {
      expenseData[expense.category] = [expense];
    }
  }

  return expenseData;
}

// this is little messedup so when amount is change only do all these
export async function updateExpenseAction(data: any) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: true, message: "User not found" };

  // Fetch original expense
  const { data: oldExpense, error: fetchError } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", data.id)
    .eq("user_id", user.id)
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

    const { data: newAccount, error: newAccountError } = await supabase
      .from("accounts")
      .select("amount")
      .eq("id", data.accountID)
      .single();

    if (newAccountError || !newAccount) {
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

    const { error: updateNewAccountError } = await supabase
      .from("accounts")
      .update({
        amount: newBalance,
      })
      .eq("id", data.accountID);

    if (updateNewAccountError) {
      await supabase
        .from("accounts")
        .update({
          amount: oldAccount.amount,
        })
        .eq("id", oldExpense.account_id);

      return {
        error: true,
        message: `Failed to update new account balance: ${updateNewAccountError.message}`,
      };
    }
  }

  const { error: updateExpenseError } = await supabase
    .from("transactions")
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

export async function getTotalAmountByType(type: "income" | "expense") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: true, message: "User not found" };

  const { data: category } = await supabase
    .from("category")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", type);

  if (!category) return { error: true, message: "Failed to fetch categories" };

  const categoryIds = category.map((cat) => cat.id);

  const { data, error } = await supabase
    .from("transaction")
    .select("*")
    .eq("user_id", user.id)
    .in("category_id", categoryIds);

  if (error) {
    return { error: true, message: error.message };
  }

  if (!data || data.length === 0) {
    return { error: false, amount: 0 };
  }
  console.log("filterData", data);

  const amount =
    data?.reduce((acc, transaction) => acc + transaction.amount, 0) ?? 0;

  console.log("amount", amount);

  return {
    error: false,
    amount,
  };
}

export async function addExpenseAction(data: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: true, message: "User not found" };

  const { error } = await supabase.from("transaction").insert({
    description: data.description,
    user_id: user.id,
    category_id: data.category,
    amount: data.amount,
    date: data.date,
  });

  if (error) return { error: true, message: error.message };
  revalidatePath("/dashboard");

  return { error: false, message: "expense added successfully" };
}
