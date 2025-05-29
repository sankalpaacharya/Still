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
        return {error:"user is not authenticated"}
    }
    data["user_id"] = user?.id
    const response = await supabase.from("expenses").insert({user_id:data["user_id"],category_group:data.categoryGroup,category:data.category,amount:data.amount})

    console.log(response.error)
    console.log(response.data)

}