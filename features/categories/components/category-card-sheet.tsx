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
          <SheetTitle>Are you absolutely sure?</SheetTitle>
        </SheetHeader>
        <div className="space-y-5 px-10">
          <CategoryCard
            name={formValues?.username || ""}
            icon={formValues?.icon || "✅"}
            currentAmount={0}
            budgetAmount={formValues?.budget || 0}
            transactionCount={0}
            trend={{ direction: "up", percentage: 12 }}
            gradient="from-blue-500 to-blue-400"
            className=""
          />
          <CategoryForm
            setWatchValues={setFormValues}
            onSubmit={(data) => console.log("this is the data", data)}
            className="w-full"
            defaultValues={{
              username: "",
              color: "#265d98",
              budget: 0,
              icon: "🇳🇵",
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
