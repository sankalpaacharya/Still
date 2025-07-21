"use server";
import { createClient } from "@/utils/supabase/server";
import { CategoryFormType } from "../components/category-form";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(data: CategoryFormType) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: true, message: "user not found" };
  const { data: categoryData, error } = await supabase
    .from("category")
    .select("*")
    .eq("name", data.name);
  console.log(error?.message);
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
