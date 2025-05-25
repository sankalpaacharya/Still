"use client";
import { Blinds } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CategoryTable } from "./categorytable";
import { Category, useBudgetStore } from "@/lib/store";
import { AddCategoryPopover } from "./AddCategoryPopover";
import { useState } from "react";

type CategoryGroupProps = {
  icon?: React.ReactNode;
  name: string;
  defaultOpen?: boolean;
  categories: Category[];
  onAddCategory?: (name: string) => void;
};

export function CategoryGroup({
  icon = <Blinds size={18} />,
  name,
  categories,
  defaultOpen = true,
  onAddCategory,
}: CategoryGroupProps) {
  const [categoryName, setCategoryName] = useState<string>("");
  const { updateCategoryGroup } = useBudgetStore((state) => state);
  const updateCategoryName = () => {
    updateCategoryGroup(name, categoryName);
  };

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultOpen ? ["category-group"] : []}
      className="w-full"
    >
      <AccordionItem value="category-group" className="border-none">
        <AccordionTrigger className="group hover:no-underline bg-white/10 p-5 rounded-b-none rounded-t-md font-semibold text-lg">
          <div className="flex gap-4 items-center w-full">
            <div className="flex gap-2 items-center flex-1">
              {icon}
              <div onClick={(e) => e.stopPropagation()}>
                <Popover>
                  <PopoverTrigger asChild>
                    <span className="hover:underline cursor-pointer">
                      {name}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Input
                      defaultValue={name}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                    <div className="mt-3 space-x-2">
                      <Button>Cancel</Button>
                      <Button onClick={updateCategoryName}>Ok</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <AddCategoryPopover onAddCategory={onAddCategory} />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="border rounded-md rounded-t-none">
          <CategoryTable categories={categories} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
