"use server";
import { createClient } from "@/utils/supabase/server";
import { CategoryFormType } from "../components/category-form";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(data: CategoryFormType, id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: true, message: "user not found" };
  const { data: categoryData, error } = await supabase
    .from("category")
    .select("*")
    .eq("name", data.name);
  if (error)
    return { error: true, message: "some error while getting category" };
  if (categoryData.length > 0)
    return { error: true, message: "category with this name already exist" };
  const { data: insertData, error: insertError } = await supabase
    .from("category")
    .insert({ ...data, user_id: user.id });

  if (insertError) return { error: true, message: insertError.message };
  revalidatePath("/categories");
  return { error: false, message: "category added!" };
}

export async function updateCategoryAction(data: CategoryFormType, id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: true, message: "User not found" };
  }

  const { error: updateError } = await supabase
    .from("category")
    .update({ ...data })
    .eq("id", id);

  if (updateError) {
    console.error(updateError.message);
    return { error: true, message: updateError.message };
  }

  revalidatePath("/categories");

  return { error: false, message: "Category updated successfully!" };
}

export async function getAllCategories() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .eq("user_id", user.id);
  if (error) return [];
  return data;
}
