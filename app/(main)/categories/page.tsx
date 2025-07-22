import CategoryCard from "@/features/categories/components/category-card";
import CategoryCardSheet from "@/features/categories/components/category-card-sheet";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createCategoryAction } from "@/features/categories/actions";
import { getUserCategories } from "@/features/categories/query";
import { getCssHslGradient } from "@/lib/utils";

export default async function Page() {
  const categories = await getUserCategories();
  console.log(categories);
  return (
    <main className="p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Your Categories</h1>
        <p className="text-muted-foreground text-sm">
          A summary of all your expense categories with budget usage and trends.
        </p>
      </div>
      <Tabs defaultValue="expense" className="w-full bg-transparent">
        <TabsList className="w-full bg-transparent mb-2 border-b border-border h-auto p-0 rounded-none">
          <TabsTrigger
            value="expense"
            className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-auto"
          >
            Expense
          </TabsTrigger>
          <TabsTrigger
            value="income"
            className="bg-transparent border-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 h-auto"
          >
            Income
          </TabsTrigger>
        </TabsList>
        <TabsContent value="expense">
          <div className="grid grid-cols-3 gap-10">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                icon={category.icon}
                currentAmount={4000}
                budgetAmount={category.budget}
                transactionCount={14}
                trend={{ direction: "up", percentage: 60 }}
                gradient={getCssHslGradient(
                  category.color || "hsl(233,36%,26%)",
                )}
              />
            ))}
            <CategoryCardSheet onSubmit={createCategoryAction}>
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
        </TabsContent>
        <TabsContent value="income">
          <div className="grid grid-cols-3 gap-10">
            <CategoryCard
              name="Food & Dining"
              icon="🍔"
              currentAmount={1240}
              budgetAmount={1800}
              transactionCount={14}
              trend={{ direction: "up", percentage: 60 }}
              gradient="from-blue-500 to-blue-400"
            />
            <CategoryCardSheet onSubmit={createCategoryAction}>
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
        </TabsContent>
      </Tabs>
    </main>
  );
}
