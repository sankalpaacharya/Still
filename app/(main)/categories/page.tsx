"use client";
import CategoryCard from "@/features/categories/components/category-card";
import CategoryCardSheet from "@/features/categories/components/category-card-sheet";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <main className="p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Your Categories</h1>
        <p className="text-muted-foreground text-sm">
          A summary of all your expense categories with budget usage and trends.
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full bg-transparent">
        <TabsList className="w-full bg-transparent mb-2">
          <TabsTrigger value="expense" className="">
            Expense
          </TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
        <TabsContent value="expense">
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
            <CategoryCardSheet>
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
            <CategoryCardSheet>
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
      {/* <CategoryForm
        onSubmit={(data) => console.log("this is the data", data)}
        defaultValues={{
          username: "",
          color: "#265d98",
          budget: 0,
          icon: "🇳🇵",
        }}
      /> */}
    </main>
  );
}
