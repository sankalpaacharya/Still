"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getDaysInMonth } from "date-fns";
import { uploadSnapToAI } from "@/server/chat";
import { format } from "date-fns";

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

type transaction = {
  amount: number;
  category_id: string;
  user_id: string;
  category: string;
  date: string;
};

type transactionItem = {
  [itemName: string]: transaction;
};

export type Category = {
  id: string;
  name: string;
  userId: string;
};

export async function NewAddExpenseAction(data: transactionItem) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: true, message: "User not found" };
  }
  const { error: insertError } = await supabase.from("transaction").insert(
    Object.entries(data).map(([itemName, item]) => ({
      user_id: user.id,
      amount: item.amount,
      description: itemName || "",
      category_id: item.category_id,
      date: item.date || new Date().toISOString().split("T")[0], // Include date field
    })),
  );
  if (insertError) {
    return { error: true, message: insertError.message };
  }
  revalidatePath("/dashboard");
  return { error: false, message: "Expense added successfully" };
}

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
    .from("transaction")
    .select("category_id, amount")
    .eq("user_id", user.id)
    .gte("created_at", startOfMonth.toISOString())
    .lte("created_at", endOfMonth.toISOString());
  if (error || !transactions) return [];

  const { data: category } = await supabase
    .from("category")
    .select("id, name, icon")
    .in(
      "id",
      transactions.map((tx) => tx.category_id),
    );
  if (!category) return [];

  const grouped: Record<
    string,
    { name: string; category_id: string; amount: number; icon: string }
  > = {};

  for (const tx of transactions) {
    const id = tx.category_id;
    if (!grouped[id]) {
      grouped[id] = {
        name: category.find((c) => c.id === id)?.name || "Unknown",
        category_id: tx.category_id,
        amount: 0,
        icon: category.find((c) => c.id === id)?.icon || "default-icon",
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
    .from("category")
    .select("id, budget")
    .in("id", categoryIds);

  console.log("month key", monthKey);

  const assignMap: Record<string, number> = {};
  for (const item of monthsData || []) {
    assignMap[item.id] = item.budget ?? 0;
  }
  console.log(
    top5.map((item) => ({
      ...item,
      assigned: assignMap[item.category_id] || 0,
    })),
  );
  return top5.map((item) => ({
    ...item,
    assigned: assignMap[item.category_id] || 0,
  }));
}

// put limit here
export async function getRecentTransactions() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) return [];

  const { data, error } = await supabase
    .from("transaction")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("user_id", user.id)
    .limit(5);

  if (error || !data) return [];

  const { data: category } = await supabase
    .from("category")
    .select("id, name, icon, budget, type")
    .eq("user_id", user.id);

  if (!category) return [];

  const enrichedTransactions = data.map((transaction) => {
    const categoryInfo = category.find(
      (cat) => cat.id === transaction.category_id,
    );
    return {
      ...transaction,
      category: categoryInfo?.name || "Uncategorized",
      icon: categoryInfo?.icon || "default-icon",
      budget: categoryInfo?.budget || 0,
      type: categoryInfo?.type || "expense",
    };
  });

  return enrichedTransactions;
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
    .from("transaction")
    .select("amount")
    .eq("user_id", user.id)
    .gte("created_at", startOfMonth.toISOString())
    .lte("created_at", now.toISOString());

  if (error || !data) return 0;

  const total = data.reduce((sum, item) => sum + item.amount, 0);
  return total;
}

export async function getTransactionOfMonth() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) return {};

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const { data } = await supabase
    .from("transaction")
    .select("amount, date")
    .eq("user_id", user.id)
    .gte("date", startOfMonth.toISOString())
    .lte("date", endOfMonth.toISOString());

  const numberOfDays = getDaysInMonth(now);
  const spentInDay: Record<number, number> = {};
  for (let i = 1; i <= numberOfDays; i++) {
    spentInDay[i] = 0;
  }

  data?.forEach((tx) => {
    const day = new Date(tx.date).getDate();
    spentInDay[day] += tx.amount;
  });

  return spentInDay;
}

export async function getCategories() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) return [];

  const { data, error } = await supabase
    .from("category")
    .select("*")
    .eq("user_id", user.id);
  if (error) return [];

  return data as Category[];
}

export async function uploadImageAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      throw new Error("No image provided");
    }

    if (!["image/jpeg", "image/png"].includes(imageFile.type)) {
      throw new Error("Invalid image format. Only JPEG and PNG are supported.");
    }

    const result = await uploadSnapToAI(imageFile);
    if (!result) {
      throw new Error("AI parsing failed");
    }

    try {
      const parsed = JSON.parse(result);
      if ("error" in parsed) {
        throw new Error(parsed.error);
      }
      return parsed;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      throw new Error("Invalid AI response format");
    }
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export async function getAllMonthExpenses() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) return {};

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const { data } = await supabase
    .from("transaction")
    .select("id, amount, date, description, category_id(name)")
    .eq("user_id", user.id)
    .gte("date", startOfMonth.toISOString())
    .lte("date", endOfMonth.toISOString());
  if (!data) return [];

  // ik this is not a way of doing and it sucks but still it's fine for now
  const hashMap: Record<string, (typeof data)[0][]> = {};

  for (let tx of data) {
    const formatedDate = format(new Date(data[0].date), "dd-MM-yyyy");
    if (!hashMap[formatedDate]) {
      hashMap[formatedDate] = [tx];
    }
  }

  return hashMap;
}
