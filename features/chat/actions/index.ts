"use server";
import { createClient } from "@/utils/supabase/server";
import { Category } from "@/features/dashboard/actions";

type Transaction = {
  category_id: string;
  user_id: string;
  amount: number;
  date: string;
};

export async function getFullUserInfo(): Promise<{
  categories: Category[];
  transactions: Transaction[];
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data: categories, error: categoriesError } = await supabase
    .from("category")
    .select("*")
    .eq("user_id", user.id);

  if (categoriesError) {
    throw new Error("Failed to fetch categories");
  }

  const { data: transactions, error: transactionsError } = await supabase
    .from("transaction")
    .select("*")
    .eq("user_id", user.id);

  if (transactionsError) {
    throw new Error("Failed to fetch transactions");
  }

  return { categories, transactions };
}
