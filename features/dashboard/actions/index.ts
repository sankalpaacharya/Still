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
   
}

export async function addExpenseAction(data:Expense){
    const supabase = await createClient()
    const {data:{user},error} = await supabase.auth.getUser()
    if(error){
        return {error:true,message:"user not found"}
    }
    data.userId = user?.id
    const {error:insertError} = await supabase.from("expenses").insert({user_id:data.userId,category_group:data.categoryGroup,category:data.category,amount:data.amount,description:data.description,category_id:data.categoryId})
    if(insertError) return {error:true,message:insertError.message}
    return {error:false,message:"Expense Added"}

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