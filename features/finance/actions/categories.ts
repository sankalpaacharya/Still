"use server";
import { createClient } from "@/utils/supabase/server";
import { Target } from "@/lib/store";

type CategoryGroup = {
  title: string;
};

type Category = {
  categoryGroupName: string;
  title: string;
};

type UpdateCategoryGroup = {
  title: string;
  newTitle: string;
};

type UpdateCategory = {
  title: string;
  newTitle: string;
  categoryGroupName?: string;
};

type ActionResult = {
  error: boolean;
  message: string;
};

async function getAuthenticatedSupabase() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: true, message: "you are not authenticated" } as const;
  }

  return { supabase, user, error: false } as const;
}

export async function addCategoryGroupAction({
  title,
}: CategoryGroup): Promise<ActionResult> {
  const auth = await getAuthenticatedSupabase();
  if (auth.error) return { error: true, message: auth.message };

  const { supabase, user } = auth;
  const { error } = await supabase
    .from("category_groups")
    .insert({ user_id: user.id, name: title });

  return error
    ? { error: true, message: error.message }
    : { error: false, message: "category group added" };
}

export async function addCategoryAction({
  title,
  categoryGroupName,
}: Category): Promise<ActionResult> {
  const auth = await getAuthenticatedSupabase();
  if (auth.error) return { error: true, message: auth.message };

  const { supabase, user } = auth;

  const { data: categoryGroup, error: categoryGroupError } = await supabase
    .from("category_groups")
    .select("*")
    .eq("name", categoryGroupName)
    .eq("user_id", user.id)
    .single();

  if (categoryGroupError || !categoryGroup) {
    return { error: true, message: "no such category group" };
  }

  const { error } = await supabase
    .from("categories")
    .insert({ name: title, category_group_id: categoryGroup.id });

  return error
    ? { error: true, message: "can't insert the category" }
    : { error: false, message: "new category has been added" };
}

export async function updateCategoryGroupAction({
  title,
  newTitle,
}: UpdateCategoryGroup): Promise<ActionResult> {
  const auth = await getAuthenticatedSupabase();
  if (auth.error) return { error: true, message: auth.message };

  const { supabase, user } = auth;
  const { error } = await supabase
    .from("category_groups")
    .update({ name: newTitle })
    .eq("name", title)
    .eq("user_id", user.id);

  return error
    ? { error: true, message: "error while updating category group" }
    : { error: false, message: "category group updated" };
}

export async function updateCategoryAction({
  title,
  newTitle,
  categoryGroupName,
}: UpdateCategory): Promise<ActionResult> {
  const auth = await getAuthenticatedSupabase();
  if (auth.error) return { error: true, message: auth.message };

  const { supabase, user } = auth;

  let updateData: any = { name: newTitle };

  if (categoryGroupName) {
    const { data: categoryGroup, error: categoryGroupError } = await supabase
      .from("category_groups")
      .select("*")
      .eq("name", categoryGroupName)
      .eq("user_id", user.id)
      .single();

    if (categoryGroupError || !categoryGroup) {
      return { error: true, message: "specified category group not found" };
    }

    updateData.category_group_id = categoryGroup.id;
  }

  const { error } = await supabase
    .from("categories")
    .update(updateData)
    .eq("name", title);

  return error
    ? { error: true, message: "error while updating category" }
    : { error: false, message: "category updated" };
}

export async function saveCategoryTargetAction({
  selectedGroup,
  selectedCategory,
  target,
}: {
  selectedGroup: string;
  selectedCategory: string;
  target: Target;
}): Promise<ActionResult> {
  const auth = await getAuthenticatedSupabase();
  if (auth.error) return { error: true, message: auth.message };

  const { supabase, user } = auth;
  if (!user) return { error: true, message: "no user found" };

  const { data: categoryGroup, error: categoryGroupError } = await supabase
    .from("category_groups")
    .select("id")
    .eq("name", selectedGroup)
    .eq("user_id", user.id)
    .single();

  if (categoryGroupError || !categoryGroup) {
    return { error: true, message: "category group not found" };
  }

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("name", selectedCategory)
    .eq("category_group_id", categoryGroup.id)
    .single();

  if (categoryError || !category) {
    return { error: true, message: "category not found" };
  }

  const targetData: any = {
    category_id: category.id,
    type: target?.type,
    amount: target?.need,
    yearly: null,
    monthly: null,
    weekly: null,
  };

  if (target?.type === "monthly") {
    targetData["monthly"] = target.on;
  } else if (target?.type === "weekly") {
    targetData["weekly"] = target.every;
  } else if (target?.type === "yearly") {
    targetData["yearly"] = target.date;
  }

  const { data: existingTarget } = await supabase
    .from("category_targets")
    .select("id")
    .eq("category_id", category.id)
    .single();

  let error;
  if (existingTarget) {
    const { error: updateError } = await supabase
      .from("category_targets")
      .update(targetData)
      .eq("category_id", category.id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from("category_targets")
      .insert(targetData);
    error = insertError;
  }

  return error
    ? { error: true, message: "error while saving target" }
    : { error: false, message: "target saved successfully" };
}

export async function assignMoney({
  assign,
  selectedGroup,
  selectedCategory,
}: {
  month: Date;
  assign: number;
  selectedGroup: string;
  selectedCategory: string;
}): Promise<ActionResult> {
  const auth = await getAuthenticatedSupabase();
  if (auth.error) return { error: true, message: auth.message };

  const { supabase, user } = auth;
  if (!user) return { error: true, message: "no user found" };

  const { data: categoryGroup, error: categoryGroupError } = await supabase
    .from("category_groups")
    .select("id")
    .eq("name", selectedGroup)
    .eq("user_id", user.id)
    .single();

  if (categoryGroupError || !categoryGroup) {
    return { error: true, message: "category group not found" };
  }

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("name", selectedCategory)
    .eq("category_group_id", categoryGroup.id)
    .single();

  if (categoryError || !category) {
    return { error: true, message: "category not found" };
  }
  // how im handling date is pretty messed up so fix that

  const monthKey = "2025-06-01";

  const { data: existingAssignment } = await supabase
    .from("category_months")
    .select("id")
    .eq("category_id", category.id)
    .eq("month", monthKey)
    .single();

  let error;
  if (existingAssignment) {
    const { error: updateError } = await supabase
      .from("category_months")
      .update({ assign })
      .eq("category_id", category.id)
      .eq("month", monthKey);
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from("category_months")
      .insert({
        category_id: category.id,
        month: monthKey,
        assign,
      });
    error = insertError;
  }

  return error
    ? { error: true, message: "error while assigning money" }
    : { error: false, message: "money assigned successfully" };
}
