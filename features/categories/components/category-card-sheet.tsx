"use client";
import { ReactNode, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CategoryForm from "./category-form";
import CategoryCard from "./category-card";
import { CategoryFormType } from "./category-form";
import { getCssHslGradient } from "@/lib/utils";
import { CategoryType } from "./category-form";

type Props = { children: ReactNode; onSubmit: any };

export default function CategoryCardSheet({ children, onSubmit }: Props) {
  const [formValues, setFormValues] = useState<Partial<CategoryFormType>>();
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="w-full max-w-none h-screen overflow-auto pb-20"
        style={{ maxWidth: "40%" }}
      >
        <SheetHeader>
          <SheetTitle>Add new category</SheetTitle>
        </SheetHeader>
        <div className="space-y-5 px-10">
          <CategoryCard
            name={formValues?.name || "Title"}
            icon={formValues?.icon || "✅"}
            currentAmount={0}
            budgetAmount={formValues?.budget || 0}
            transactionCount={0}
            trend={{ direction: "up", percentage: 50 }}
            gradient={getCssHslGradient(
              formValues?.color || "hsl(233,36%,26%)",
            )}
          />
          <CategoryForm
            setWatchValues={setFormValues}
            onFormSubmit={onSubmit}
            className="w-full"
            type=""
            defaultValues={{
              name: "",
              color: "hsl(233,36%,26%)",
              budget: 0,
              icon: "🇳🇵",
              type: CategoryType.Expense,
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
