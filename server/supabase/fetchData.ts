import { createClient } from "@/utils/supabase/server";
export interface Category {
  id: string;
  name: string;
}

export interface CategoryGroup {
  id: string;
  name: string;
  categories: Category[];
}

export interface Transaction {
  amount: number;
  category: string;
  category_group: string;
  description: string;
  type: string;
  category_id: string;
  account_id: string;
}

export interface Account {
  id: string;
  name: string;
  amount: number;
  type: string;
}

export interface Target {
  id: string;
  name: string;
  category_months: Array<{
    activity: number;
    assign: number;
    available: number;
    month: string;
  }>;
  category_targets: Array<{
    type: string;
    amount: number;
    yearly: boolean;
    monthly: boolean;
    weekly: boolean;
  }>;
}

export async function getCategories(): Promise<
  [{ [key: string]: Array<[string, string]> }, CategoryGroup[]]
> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const response = await supabase
    .from("category_groups")
    .select("name, categories(id,name), id")
    .eq("user_id", user.id);

  const result: { [key: string]: Array<[string, string]> } = {};

  response.data?.forEach((item) => {
    const groupName = item.name;
    item.categories.forEach((category: Category) => {
      if (!result[groupName]) result[groupName] = [];
      result[groupName].push([category.name, category.id]);
    });
  });

  return [result, response.data as CategoryGroup[]];
}

export async function storeFinance(data: string) {
  try {
    const parsed: Transaction = JSON.parse(data);
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const response = await supabase.from("transactions").insert({
      user_id: user.id,
      created_at: new Date().toISOString(),
      ...parsed,
    });

    return {
      success: true,
      message: `Successfully logged expense of ₹${parsed.amount} for ${parsed.description} in ${parsed.category} category.`,
    };
  } catch (e: any) {
    return {
      success: false,
      message: `Failed to log expense: ${e.message}`,
    };
  }
}

export async function getFullUserInfo() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const accountsResp = await supabase
    .from("accounts")
    .select("id, name, amount, type")
    .eq("user_id", user.id);
  const transactionsResp = await supabase
    .from("transactions")
    .select("amount, category_group, category, description")
    .eq("user_id", user.id);

  const [, categoryGroups] = await getCategories();

  const categoriesWithoutId = categoryGroups.map((grp: CategoryGroup) => ({
    "Category group": grp.name,
    Categories: grp.categories,
  }));

  const targetPromises = categoryGroups.map((grp: CategoryGroup) =>
    supabase
      .from("categories")
      .select(
        "id,name,category_months(activity,assign,available,month),category_targets(type,amount,yearly,monthly,weekly)",
      )
      .eq("category_group_id", grp.id),
  );

  const targetResponses = await Promise.all(targetPromises);
  const targets: Target[] = targetResponses.flatMap(
    (resp: any) => resp.data || [],
  );

  return {
    accounts: accountsResp.data as Account[],
    transactions: transactionsResp.data,
    categories: categoriesWithoutId,
    targets,
  };
}
