import toast from "react-hot-toast";
import { useBudgetStore, type CategoryGroup, type Target } from "./store";
import { createClient } from "@/utils/supabase/client";

interface BudgetStoreData {
  groups: CategoryGroup[];
  totalAmount: number;
}

interface ErrorResponse {
  error: true;
  message: string;
}

export const initBudgetStoreSync = () => {
  const unsub = useBudgetStore.subscribe(
    (state) => ({ selectedMonth: state.selectedMonth }),
    async (newState, prevState) => {
      if (newState.selectedMonth !== prevState.selectedMonth) {
        await hydrateBudgetStoreForMonth(newState.selectedMonth);
      }
    },
  );
  return unsub;
};

export async function getHydrateData(
  selectedMonth?: string,
): Promise<BudgetStoreData | ErrorResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: true, message: "no user found" };

  const todayDate = new Date();
  let monthString = selectedMonth;
  if (!selectedMonth) {
    monthString = todayDate.toISOString().slice(0, 7) + "-01";
  }

  const { data, error } = await supabase
    .from("category_groups")
    .select(
      `
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
    `,
    )
    .eq("user_id", user.id)
    .eq("is_hidden", false)
    .eq("categories.is_hidden", false)
    .eq("categories.category_months.month", monthString);

  if (error) {
    return { error: true, message: error.message };
  }

  const forZustand: BudgetStoreData = {
    groups: data.map((categoryGroup) => ({
      id: categoryGroup.id,
      name: categoryGroup.name,
      categories: categoryGroup.categories.map((category) => {
        const categoryMonth = category.category_months?.[0] || {
          activity: 0,
          assign: 0,
          available: 0,
        };
        const categoryTarget = category.category_targets?.[0];

        let target: Target = null;
        if (categoryTarget) {
          if (categoryTarget.type === "monthly") {
            target = {
              on: categoryTarget.monthly,
              need: categoryTarget.amount || 0,
              type: "monthly",
            };
          } else if (categoryTarget.type === "yearly") {
            target = {
              date: new Date(categoryTarget.yearly),
              need: categoryTarget.amount || 0,
              type: "yearly",
            };
          } else if (categoryTarget.type === "weekly") {
            target = {
              every: categoryTarget.weekly,
              type: "weekly",
              need: categoryTarget.amount || 0,
            };
          }
        }

        return {
          id: category.id,
          name: category.name,
          assign: categoryMonth.assign,
          target: target,
          activity: categoryMonth.activity,
          avaialble: categoryMonth.available,
        };
      }),
    })),
    totalAmount: 5000,
  };
  console.log(forZustand);
  return forZustand;
}

export async function hydrateBudgetStoreForMonth(selectedMonth: string) {
  try {
    const data = await getHydrateData(selectedMonth);

    if ("error" in data) {
      toast.error(data.message);
      return;
    }

    useBudgetStore.setState({
      ...data,
      selectedMonth,
    });

    useBudgetStore.getState().calculateReadyToAssign();
  } catch (error) {
    console.error("Error hydrating budget store:", error);
    toast.error("Failed to load budget data for selected month");
  }
}

export async function hydrateBudgetStore() {
  try {
    const data = await getHydrateData();

    if ("error" in data) {
      toast.error(data.message);
      return;
    }

    useBudgetStore.setState({ ...data });
    useBudgetStore.getState().calculateReadyToAssign();
  } catch (error) {
    console.error("Error hydrating budget store:", error);
    toast.error("Failed to load budget data");
  }
}
