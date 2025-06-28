"use server"
import { createClient } from "@/utils/supabase/server"

type Account = {
    name:string,
    type:string,
    amount:number
}

export async function addAccountAction({name,type,amount}:Account) {
    const supabase = await createClient()
    const {data:{user}} = await supabase.auth.getUser()
    if (!user) return {error:true,message:"user not found"}
    const insertData = {
        user_id:user.id,
        name,
        type,
        amount
    }
    const {error} = await supabase.from("accounts").insert(insertData)
    if(error)return {error:true, message:error.message}
    return {error:false, message:"account has been added"} 
}


export async function getUserAccounts():Promise<any[]>{
    const supabase = await createClient()
    const {data:{user}} = await supabase.auth.getUser()
    if (!user) return []
    const {data,error} = await supabase.from("accounts").select("*").eq("user_id",user.id)
    if (error) return []
    return data ?? [] 
}

