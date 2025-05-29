import { useBudgetStore } from "./store";
import { createClient } from "@/utils/supabase/client";

export const initBudgetStoreSync = ()=>{

const unsub = useBudgetStore.subscribe((state)=>({totalAmount:state.totalAmount,groups:state.groups}),async (newState,prevState)=>{
    console.log("is it called?")
    const supabase = await createClient()
    const {data:{user}} = await supabase.auth.getUser()
    if (
        JSON.stringify(newState.totalAmount) !== JSON.stringify(prevState.totalAmount) ||
        JSON.stringify(newState.groups) !== JSON.stringify(prevState.groups)
      ){
        try{
            const {data,error} = await supabase.from("finance").update({data:newState}).eq("user_id",user?.id)
            console.log("error while syncing",error)
        }
        catch(e){
            console.log("syncing error",e)
        }

      }
})

return unsub

}
