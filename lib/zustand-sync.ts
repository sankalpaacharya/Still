import { useBudgetStore } from "./store";
// change to server, i will not turn on rls for now so it's safe to call from server
import { createClient } from "@/utils/supabase/client";

const initBudgetStoreSync = ()=>{

const unsub = useBudgetStore.subscribe((state)=>({totalAmount:state.totalAmount,groups:state.groups}),async ()=>{
const supabase = await createClient()


})


}
