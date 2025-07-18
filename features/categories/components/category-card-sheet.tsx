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

type Props = { children: ReactNode };

export default function CategoryCardSheet({ children }: Props) {
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
            name={formValues?.username || "Title"}
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
            onSubmit={(data) => console.log("this is the data", data)}
            className="w-full"
            type="expense"
            defaultValues={{
              username: "",
              color: "hsl(233,36%,26%)",
              budget: 0,
              icon: "🇳🇵",
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
