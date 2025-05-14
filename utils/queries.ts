//  idk if this is super stupid or good we will figure it out later, im just experimenting things.

import { SupabaseClient } from "@supabase/supabase-js"

class DatabaseClient{
    client:Promise<SupabaseClient>
    constructor(client:Promise<SupabaseClient>){
        this.client = client
    }

    async getAuthUser(){
        const {data,error} = await (await this.client).auth.getUser()
        if(error){
            return error
        }
        return data
    }
   
}