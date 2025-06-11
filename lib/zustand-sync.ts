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


// export async function hydrateBugetStore(){
//   const supabase = await createClient()
//   const {data:{user}} =  await supabase.auth.getUser()
//   const {data} = await supabase.from("finance").select("data").eq("user_id",user?.id).single()
//   useBudgetStore.setState({
//     ...data?.data
//   })
// }


export async function hydrateBugetStore(){
  const supabase = await createClient()
  const {data:{user}} =  await supabase.auth.getUser()
  if (!user) return {error: true, message: "no user found"}
  const selectedMonth = new Date()
  const monthString = selectedMonth.toISOString().slice(0, 7) + '-01'

  const { data, error } = await supabase
    .from('category_groups')
    .select(`
      id,
      name,
      is_hidden,
      created_at,
      categories (
        id,
        name,
        is_hidden,
        created_at,
        category_months!category_months_category_id_fkey (
          id,
          activity,
          assign,
          available,
          month
        ),
        category_targets(id,type,monthly,yearly,weekly,amount)
      )
    `)
    .eq('user_id', user.id)
    .eq('is_hidden', false)
    .eq('categories.is_hidden', false)
    .eq('categories.category_months.month', monthString);
     
  if (error) {
    return { error: true, message: error.message }
  }

  const forZustand:any = {
    groups: data.map((categoryGroup) => ({
      name: categoryGroup.name,
      categories: categoryGroup.categories.map((category) => {
        const categoryMonth = category.category_months?.[0] || {
          activity: 0,
          assign: 0,
          available: 0
        };

        const categoryTarget = category.category_targets?.[0];

        let target = null;
        if (categoryTarget) {
          if (categoryTarget.type === 'monthly') {
            target = {
              on: categoryTarget.monthly, 
              need: categoryTarget.amount || 0,
              type: 'monthly'
            };
          } else if (categoryTarget.type === 'yearly') {
            target = {
              date: categoryTarget.yearly, 
              need: categoryTarget.amount || 0,
              type: 'yearly'
            };
          } else if(categoryTarget.type==="weekly"){
            target = {
               every:categoryTarget. weekly,
                type:"weekly",
                need: categoryTarget.amount || 0
            }
          }
        }

        return {
          name: category.name,
          assign: categoryMonth.assign,
          target: target,
          activity: categoryMonth.activity,
          available: categoryMonth.available 
        };
      })
    })),
    totalAmount: 5000 
  };

useBudgetStore.setState({
    ...forZustand
  })
}