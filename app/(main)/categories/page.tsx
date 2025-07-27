import CategoryCard from "@/features/categories/components/category-card";
import CategoryCardSheet from "@/features/categories/components/category-card-sheet";
import { Plus } from "lucide-react";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/features/categories/actions";
import { getUserCategories } from "@/features/categories/query";
import { getCssHslGradient } from "@/lib/utils";

export default async function Page() {
  const categories = await getUserCategories();
  return (
    <main className="p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Your Categories</h1>
        <p className="text-muted-foreground text-sm">
          A summary of all your expense categories with budget usage and trends.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-10">
        {categories.map((category) => (
          <CategoryCardSheet
            key={category.id}
            id={category.id}
            defaultValues={{
              name: category.name,
              budget: category.budget,
              icon: category.icon,
              color: category.color,
            }}
            onSubmit={updateCategoryAction}
          >
            <CategoryCard
              name={category.name}
              icon={category.icon}
              currentAmount={4000}
              budgetAmount={category.budget}
              transactionCount={14}
              trend={{ direction: "up", percentage: 60 }}
              gradient={getCssHslGradient(category.color || "hsl(233,36%,26%)")}
            />
          </CategoryCardSheet>
        ))}
        <CategoryCardSheet
          defaultValues={{
            name: "title",
            budget: 100,
            icon: "💻",
            color: "hsl(233,36%,26%)",
          }}
          onSubmit={createCategoryAction}
        >
          <button className="flex flex-col cursor-pointer items-center justify-center  p-6 border-2 border-dashed border-white/20 rounded-xl transition-all hover:bg-white/5">
            <div className="p-4 rounded-full bg-white/10 mb-4">
              <Plus className="h-6 w-6" />
            </div>
            <p className="text-lg font-medium">Add New Category</p>
            <p className="text-sm text-muted-foreground mt-2">
              Track another financial account
            </p>
          </button>
        </CategoryCardSheet>
      </div>
    </main>
  );
}
