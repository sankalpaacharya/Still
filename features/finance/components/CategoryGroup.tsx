"use client";
import { Blinds } from "lucide-react";
import { useState } from "react";
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
import toast from "react-hot-toast";
import {
  updateCategoryGroupAction,
  deleteCategoryGroupAction,
} from "../actions";
import { Trash } from "lucide-react";

type CategoryGroupProps = {
  id?: string;
  icon?: React.ReactNode;
  name: string;
  defaultOpen?: boolean;
  categories: Category[];
};

export function CategoryGroup({
  id,
  icon = <Blinds size={18} />,
  name,
  categories,
  defaultOpen = true,
}: CategoryGroupProps) {
  const [categoryName, setCategoryName] = useState<string>("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { updateCategoryGroup, groups, deleteCategoryGroup } = useBudgetStore(
    (state) => state,
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const updateCategoryName = async () => {
    if (!categoryName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (categoryName.trim() === name) {
      setIsPopoverOpen(false);
      setCategoryName("");
      return;
    }

    if (groups.some((item) => item.name === categoryName.trim())) {
      toast.error("Name already exists");
      return;
    }
    await updateCategoryGroupAction({
      title: name,
      newTitle: categoryName.trim(),
    });
    updateCategoryGroup(name, categoryName.trim());
    setIsPopoverOpen(false);
    setCategoryName("");
    toast.success("Category group name updated");
  };

  const handleCancel = () => {
    setCategoryName("");
    setIsPopoverOpen(false);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (open) {
      setCategoryName(name);
    } else {
      setCategoryName("");
    }
  };

  const handleDelete = async (name: string, id: string) => {
    deleteCategoryGroup(name);
    const result = await deleteCategoryGroupAction({ categoryID: id });
    if (result.error) return toast.error(result.message);
    toast.success(result.message);
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
                <Popover
                  open={isPopoverOpen}
                  onOpenChange={handlePopoverOpenChange}
                >
                  <PopoverTrigger asChild>
                    <span className="hover:underline cursor-pointer">
                      {name}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Input
                      value={categoryName}
                      onChange={handleInputChange}
                      placeholder="Enter category group name"
                    />
                    <div className="flex justify-between items-center mt-5">
                      <Button
                        variant={"secondary"}
                        onClick={() => handleDelete(name, id || "")}
                      >
                        <Trash />
                        Delete
                      </Button>
                      <div className=" space-x-2">
                        <Button variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button onClick={updateCategoryName}>Ok</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <AddCategoryPopover categoryGroupName={name} />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="border rounded-md rounded-t-none">
          <CategoryTable categories={categories} groupName={name} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
