import { createClient } from "@/utils/supabase/server";
import { Expense } from "../components/columns";

type GroupExpense = Record<string,Expense[]>

export async function getExpenses():Promise<GroupExpense | {}>{

    const supabase = await createClient()
    const {data:{user}} = await supabase.auth.getUser()

    if (!user) return {error:true,message:"user not found"}

    const {data,error} = await supabase.from("expenses").select("*").eq("user_id",user.id)
    if(!data) return {error:true,message:error.message}

    const expenseData:any = {}    

    for (let expense of data){
        const group = expense["category_group"];
        if(expense["category_group"] in expenseData){
            expenseData[group].push(expense)
        }
        else{
            expenseData[group] = [expense]
        }
    }

    return expenseData
}


export async function updateExpenseAction(data:any){
    const supabase = await createClient()
    const {data:{user}} = await supabase.auth.getUser()
    if (!user) return {error:true,message:"user not found"}
    const {error} = await supabase.from("expenses").update(data).eq("category_id",data["category_id"])
    if(error) return {error:true,message:"can't update the expense"}
    return {error:false,message:"updated successfully"}

}