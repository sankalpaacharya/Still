"use server";
import { createClient } from "@/utils/supabase/server";
import { CategoryFormType } from "../components/category-form";

export async function createCategoryAction(data: CategoryFormType) {
  console.log("server action is called");
  const supabase = await createClient();
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
    .insert({ ...data });
  if (insertError) return { error: true, message: insertError.message };
  console.log("this is erorr", insertError);
  return { error: false, message: "category added!" };
}
