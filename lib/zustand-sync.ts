import toast from "react-hot-toast";
import { useBudgetStore } from "./store";
// change to server, i will not turn on rls for now so it's safe to call from server
import { createClient } from "@/utils/supabase/client";

export const initBudgetStoreSync = ()=>{
const unsub = useBudgetStore.subscribe((state)=>({totalAmount:state.totalAmount,groups:state.groups}),async (newState,prevState)=>{
    const supabase = await createClient()
    const {data:{user}} = await supabase.auth.getUser()
    if (
        JSON.stringify(newState.totalAmount) !== JSON.stringify(prevState.totalAmount) ||
        JSON.stringify(newState.groups) !== JSON.stringify(prevState.groups)
      ){
        try{
            const {error} = await supabase.from("finance").update({data:newState}).eq("user_id",user?.id)
          if(error){
            toast.error("error while syncing data")
            console.log("error while syncing",error)
          }


        }
        catch(e){
            console.log("syncing error",e)
        }

      }
})
return unsub

}


export async function hydrateBugetStore(){
  const supabase = await createClient()
  const {data:{user}} =  await supabase.auth.getUser()
  const {data} = await supabase.from("finance").select("data").eq("user_id",user?.id).single()
  useBudgetStore.setState({
    ...data?.data
  })
 
}
