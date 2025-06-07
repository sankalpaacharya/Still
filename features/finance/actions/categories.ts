"use server"
import { createClient } from "@/utils/supabase/server";

type CategoryGroup = {
    title: string
}

type Category = {
    categoryGroupName: string 
    title: string
}

type UpdateCategoryGroup = {
    title: string
    newTitle:string
}

type UpdateCategory = {
    title: string
    newTitle:string
    categoryGroupName?: string
}

type ActionResult = {
    error: boolean
    message: string
}

async function getAuthenticatedSupabase() {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()
    
    if (!user) {
        return { error: true, message: "you are not authenticated" } as const
    }
    
    return { supabase, user, error: false } as const
}

export async function addCategoryGroupAction({title}: CategoryGroup): Promise<ActionResult> {
    const auth = await getAuthenticatedSupabase()
    if (auth.error) return { error: true, message: auth.message }
    
    const {supabase, user} = auth
    const {error} = await supabase.from("category_groups").insert({user_id: user.id, title})
    
    return error 
        ? {error: true, message: "error while adding data"}
        : {error: false, message: "category group added"}
}

export async function addCategoryAction({title, categoryGroupName}: Category): Promise<ActionResult> {
    const auth = await getAuthenticatedSupabase()
    if (auth.error) return { error: true, message: auth.message }
    
    const {supabase, user} = auth
    
    const {data: categoryGroup, error: categoryGroupError} = await supabase
        .from("category_groups")
        .select("*")
        .eq("title", categoryGroupName)
        .eq("user_id", user.id)
        .single()
    
    if (categoryGroupError || !categoryGroup) {
        return {error: true, message: "no such category group"}
    }
    
    const {error} = await supabase.from("categories").insert({title, category_group_id: categoryGroup.id})
    
    return error
        ? {error: true, message: "can't insert the category"}
        : {error: false, message: "new category has been added"}
}

export async function updateCategoryGroupAction({title,newTitle}: UpdateCategoryGroup): Promise<ActionResult> {
    const auth = await getAuthenticatedSupabase()
    if (auth.error) return { error: true, message: auth.message }
    
    const {supabase, user} = auth
    
    const {error} = await supabase
        .from("category_groups")
        .update({title:newTitle})
        .eq("title", title)
        .eq("user_id", user.id)
    
    return error
        ? {error: true, message: "error while updating category group"}
        : {error: false, message: "category group updated"}
}

export async function updateCategoryAction({title, newTitle, categoryGroupName}: UpdateCategory): Promise<ActionResult> {
    const auth = await getAuthenticatedSupabase()
    if (auth.error) return { error: true, message: auth.message }
    
    const {supabase, user} = auth
    
    let updateData: any = {title:newTitle}
    
    if (categoryGroupName) {
        const {data: categoryGroup, error: categoryGroupError} = await supabase
            .from("category_groups")
            .select("*")
            .eq("title", categoryGroupName)
            .eq("user_id", user.id)
            .single()
        
        if (categoryGroupError || !categoryGroup) {
            return {error: true, message: "specified category group not found"}
        }
        
        updateData.category_group_id = categoryGroup.id
    }
    
    const {error} = await supabase.from("categories").update(updateData).eq("title",title)
    
    return error
        ? {error: true, message: "error while updating category"}
        : {error: false, message: "category updated"}
}