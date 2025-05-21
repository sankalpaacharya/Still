"use client";

import { Plus, Blinds } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryTable } from "./categorytable";

type CategoryGroupProps = {
  icon?: React.ReactNode;
  title: string;
  defaultOpen?: boolean;
  onAddCategory?: (name: string) => void;
};

export function CategoryGroup({
  icon = <Blinds size={18} />,
  title,
  defaultOpen = true,
  onAddCategory,
}: CategoryGroupProps) {
  return (
    <Accordion 
      type="multiple" 
      defaultValue={defaultOpen ? ["category-group"] : []} 
      className="w-full"
    >
      <AccordionItem value="category-group" className="border-none">
        <AccordionTrigger className="group hover:no-underline bg-white/10 p-5 rounded-b-none rounded-t-md font-semibold text-lg">
          <span className="flex gap-4 items-center">
            {icon}
            {title}
            <div onClick={(e) => e.stopPropagation()}>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="p-1 rounded-full bg-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                    <Plus size={15} />
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <Input placeholder="New Category" className="mb-4" />
                  <div className="flex gap-2">
                    <Button variant={"secondary"}>Cancel</Button>
                    <Button onClick={() => onAddCategory && onAddCategory("New Category")}>Ok</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </span>
        </AccordionTrigger>
        <AccordionContent className="border rounded-md rounded-t-none">
          <CategoryTable />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
