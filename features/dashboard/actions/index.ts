"use server"
import { createClient } from "@/utils/supabase/server"

type Expense = {
   categoryGroup:string  
   category:string  
   description?:string
   amount:number
   date?:string
   userId?:string
   categoryId:string
   accountID:string
   
}

export async function addExpenseAction(data: Expense) {
    const supabase = await createClient();
  
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: true, message: "User not found" };
    }
  
    const { data: accountData, error: accountError } = await supabase
      .from("accounts")
      .select("amount")
      .eq("id", data.accountID)
      .single();
  
    if (accountError || !accountData) {
      return { error: true, message: "Account not found" };
    }
  
    if (accountData.amount < data.amount) {
      return { error: true, message: "Insufficient balance in the selected account" };
    }
  
    const { error: insertError } = await supabase.from("expenses").insert({
      user_id: user.id,
      category_group: data.categoryGroup,
      category: data.category,
      amount: data.amount,
      description: data.description,
      category_id: data.categoryId,
      account_id: data.accountID
    });
  
    if (insertError) {
      return { error: true, message: insertError.message };
    }
  
    const { error: updateError } = await supabase
      .from("accounts")
      .update({
        amount: accountData.amount - data.amount
      })
      .eq("id", data.accountID);
  
    if (updateError) {
      return { error: true, message: "Expense added but failed to update account balance" };
    }
  
    return { error: false, message: "Expense added successfully" };
  }
  


export async function mostSpentCategory(){
    // sending 5 most spending category of user
    const supabase = await createClient() 
    const {data:{user},error:userError} = await supabase.auth.getUser()
    if(!user && userError){
        return {error:true,message:"user not authenticated"}
    }
    const {data,error} = await supabase.from("categories").select("*, category_groups(user_id)").eq("category_groups.user_id",user?.id)
    console.log(error);
    if(error) return {error:true,message:"can't fetch categories"}
    return data
    
}