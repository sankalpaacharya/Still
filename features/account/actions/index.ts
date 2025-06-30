"use server";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { revalidatePath } from "next/cache";

type Account = {
  id?: string;
  name: string;
  type: string;
  amount: number;
};

export async function addAccountAction({
  name,
  type,
  amount,
}: {
  name: string;
  type: string;
  amount: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: true, message: "user not found" };
  const insertData = {
    user_id: user.id,
    name,
    type,
    amount,
  };
  const { error } = await supabase.from("accounts").insert(insertData);
  if (error) return { error: true, message: error.message };
  revalidatePath("/account");
  return { error: false, message: "account has been added" };
}

export const getUserAccounts = cache(async (): Promise<Account[]> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id);
  if (error) return [];
  return data ?? [];
});

export async function deleteAccountAction({
  accountID,
}: {
  accountID: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: true, message: "User not found" };
  const { error } = await supabase
    .from("accounts")
    .delete()
    .eq("id", accountID);
  if (error) return { error: true, message: error.message };
  revalidatePath("/account");
  return { error: false, message: "Deleted Successfully" };
}
