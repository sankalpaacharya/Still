"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getDaysInMonth, getDay } from "date-fns";
import { uploadSnapToAI, EditWithAISnap } from "@/server/chat";

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

export type transaction = {
  amount: number;
  category_id: string;
  user_id: string;
  category: string;
  date: string;
};

export type transactionItem = {
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
  const { data: insertedData, error: insertError } = await supabase
    .from("transaction")
    .insert(
      Object.entries(data).map(([itemName, item]) => ({
        user_id: user.id,
        amount: item.amount,
        description: itemName || "",
        category_id: item.category_id,
        date: item.date || new Date().toISOString().split("T")[0],
      })),
    )
    .select();
  console.log("Inserted data:", insertedData);
  if (insertError) {
    return { error: true, message: insertError.message };
  }
  revalidatePath("/dashboard");
  return {
    error: false,
    message: "Expense added successfully",
    data: insertedData,
  };
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

export async function getTopCategories(): Promise<{
  name: string;
  category_id: string;
  amount: number;
  icon: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError)
    return {
      name: "No Expenses found",
      category_id: "",
      amount: 0,
      icon: "default-icon",
    };

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
  if (error || !transactions)
    return {
      name: "No Expenses found",
      category_id: "",
      amount: 0,
      icon: "default-icon",
    };

  const { data: category } = await supabase
    .from("category")
    .select("id, name, icon")
    .in(
      "id",
      transactions.map((tx) => tx.category_id),
    );
  if (!category)
    return {
      name: "No Expenses found",
      category_id: "",
      amount: 0,
      icon: "default-icon",
    };

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

  const top1 = Object.values(grouped)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 1);
  console.log("Top category:", top1);
  return (
    top1[0] || {
      name: "No Expenses found",
      category_id: "",
      amount: 0,
      icon: "default-icon",
    }
  );
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

  const enrichedTransactions = await Promise.all(
    data.map(async (transaction) => {
      const categoryInfo = category.find(
        (cat) => cat.id === transaction.category_id,
      );

      const imageUrl = await getImageUrlForTransaction(transaction.id, user.id);

      return {
        ...transaction,
        category: categoryInfo?.name || "Uncategorized",
        icon: categoryInfo?.icon || "default-icon",
        budget: categoryInfo?.budget || 0,
        type: categoryInfo?.type || "expense",
        imageUrl,
      };
    }),
  );

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

export async function getTransactionsByDate(dateStr: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) return [];

  const dateOnly = dateStr.split(" ")[0];
  console.log("Original dateStr:", dateStr);
  console.log("Extracted dateOnly:", dateOnly);

  const startOfDay = `${dateOnly} 00:00:00.000+00`;
  const endOfDay = `${dateOnly} 23:59:59.999+00`;

  console.log("Using date range:", startOfDay, "to", endOfDay);

  let { data: transactions, error } = await supabase
    .from("transaction")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", startOfDay)
    .lte("date", endOfDay)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Database error:", error);
    return [];
  }

  if (!transactions) return [];

  const { data: categories } = await supabase
    .from("category")
    .select("id, name, icon, budget, type")
    .eq("user_id", user.id);

  if (!categories) return transactions;

  const enrichedTransactions = await Promise.all(
    transactions.map(async (transaction) => {
      const categoryInfo = categories.find(
        (cat) => cat.id === transaction.category_id,
      );

      const imageUrl = await getImageUrlForTransaction(transaction.id, user.id);

      return {
        ...transaction,
        category: categoryInfo?.name || "Uncategorized",
        icon: categoryInfo?.icon || "📝",
        budget: categoryInfo?.budget || 0,
        type: categoryInfo?.type || "expense",
        imageUrl,
      };
    }),
  );

  return enrichedTransactions;
}

export async function updateTransactionAction(data: {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryID: string;
  category: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    return { error: true, message: "User not found" };
  }

  const { error: updateError } = await supabase
    .from("transaction")
    .update({
      description: data.description,
      amount: data.amount,
      date: data.date,
      category_id: data.categoryID,
    })
    .eq("id", data.id)
    .eq("user_id", user.id);

  if (updateError) {
    return { error: true, message: "Failed to update transaction" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/cashflow");
  return { error: false, message: "Transaction updated successfully" };
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

export async function uploadImageFile(file: File) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }
    const { data, error } = await supabase.storage
      .from("items-receipts")
      .upload(`${user.id}/${file.name}`, file, {
        cacheControl: "3600",
        upsert: true,
      });
    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
  revalidatePath("/dashboard");
  return { success: true, message: "Image uploaded successfully" };
}

export async function renameImageFile(
  oldFilename: string,
  newFilename: string,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const oldPath = `${user.id}/${oldFilename}.png`;
    const newPath = `${user.id}/${newFilename}.png`;

    const { data: copyData, error: copyError } = await supabase.storage
      .from("items-receipts")
      .copy(oldPath, newPath);

    if (copyError) {
      throw new Error(`Copy failed: ${copyError.message}`);
    }

    const { error: deleteError } = await supabase.storage
      .from("items-receipts")
      .remove([oldPath]);

    if (deleteError) {
      console.error("Failed to delete old file:", deleteError);
    }

    return { success: true, message: "Image renamed successfully" };
  } catch (error) {
    console.error("Image rename failed:", error);
    throw error;
  }
}

export async function editWithAIServerAction(expenses: any, query: string) {
  const result = await EditWithAISnap(expenses, query);

  let parsed;
  if (typeof result === "string") {
    try {
      parsed = JSON.parse(result);
    } catch {
      throw new Error("AI result is not valid JSON");
    }
  } else {
    parsed = result;
  }

  if (parsed && Array.isArray(parsed)) {
    return parsed;
  } else if (parsed && typeof parsed === "object") {
    return Object.entries(parsed).map(([name, details]: [string, any]) => ({
      name,
      ...details,
    }));
  } else {
    throw new Error("Unexpected AI edit result");
  }
}

export async function getImageUrlForTransaction(
  transactionId: string,
  userId: string,
) {
  const supabase = await createClient();

  try {
    const filePath = `${userId}/${transactionId}.png`;

    const { data: fileData, error: listError } = await supabase.storage
      .from("items-receipts")
      .list(userId, {
        search: `${transactionId}.png`,
      });

    if (listError || !fileData || fileData.length === 0) {
      return null;
    }

    const { data } = supabase.storage
      .from("items-receipts")
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error getting image URL:", error);
    return null;
  }
}
