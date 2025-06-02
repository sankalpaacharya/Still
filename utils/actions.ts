"use server"
import { redirect } from "next/navigation"
import { createClient } from "./supabase/server"

export const signInWithGoogle = async ()=>{
    const supabase = await createClient()
    const {data,error} = await supabase.auth.signInWithOAuth({
        provider:"google",
        options:{
            redirectTo:"http://localhost:3000/auth/callback"
        }
    })
    if(error){
        console.log(error)
    }
    if(data.url){
    redirect(data.url)
    }

}