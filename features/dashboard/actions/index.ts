"use server"

import { createClient } from "@/utils/supabase/server"

type Expense = {
   categoryGroup:string  
   category:string  
   description?:string
   amount:number
   date?:string
   user_id?:string
}

export async function addExpenseAction(data:Expense){
    const supabase = await createClient()
    const {data:{user},error} = await supabase.auth.getUser()
    if(error){
        return {error:true,message:"user not found"}
    }
    data["user_id"] = user?.id
    const {error:insertError} = await supabase.from("expenses").insert({user_id:data["user_id"],category_group:data.categoryGroup,category:data.category,amount:data.amount,description:data.description})
    if(insertError) return {error:true,message:insertError.message}
    return {error:false,message:"Expense Added"}

}