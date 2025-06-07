"use server"
import { createClient } from "@/utils/supabase/server";

export async function createCategoryGroup(){
    const supabase = await createClient()
    const {data:{user}} = await supabase.auth.getUser() 
    if(!user){
        return {
            error:true,
            message:"you are not authenticated"
        }
    }
    const {data,error} = await supabase.from("catgeory_group").insert({user_id:user})
    if(error){
        return {
            error:true,
            mesaage:"error while adding data"
        }
    }
    return {error:false,message:"category group added"}   
}





