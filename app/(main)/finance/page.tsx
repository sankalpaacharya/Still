import React from "react";
import { CirclePlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {};

export default function Page({}: Props) {
  return (
    <div>
      <TotalAmountStatus amount={2889} />
      <div className="flex justify-between mb-6">
        <Popover>
          <PopoverTrigger>
            <div className="flex gap-2 items-center text-blue-300 p-2 px-3 hover:bg-blue-500/10 rounded-md cursor-pointer">
              <CirclePlus size={18} className="" />
              Add Category
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Input
              type="text"
              className="mb-5"
              placeholder="Add new Category"
            />
            <div className="flex gap-2">
              <Button
                variant={"secondary"}
                className="bg-indigo-400/20 hover:bg-indigo-400/15"
              >
                Cancel
              </Button>
              <Button className="bg-indigo-400 hover:bg-indigo-500">Ok</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <BudgetTable />
    </div>
  );
}

function TotalAmountStatus({ amount }: { amount: number }) {
  return (
    <div className="flex justify-center">
      <div className="p-4 bg-green-700 rounded-md shadow-2xl flex w-72 justify-between">
        <div>
          <h2 className="text-3xl font-bold">₹{amount}</h2>
          <p className="text-sm">Ready Assign</p>
        </div>
        <Button className="shadow-xl cursor-pointer">Assign</Button>
      </div>
    </div>
  );
}

function BudgetTable() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between bg-white/10 p-3 pr-5 rounded-md">
        <span>Category</span>
        <div className="flex">
          <span className="w-26">Assigned</span>
          <span className="w-26">Activity</span>
          <span className="w-26">Available</span>
        </div>
      </div>
      <CategoryGroup />
    </div>
  );
}

function CategoryGroup() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="hover:no-underline bg-white/10 p-3 rounded-t-md rounded-b-none border-b-1 font-semibold text-md">
          Savings
        </AccordionTrigger>
        <AccordionContent className="bg-white/10 p-3 rounded-b-md rounded-t-none px-4 text-lg flex justify-between">
          <span>💻 TV, Phone, Internet</span>
          <div className="flex">
            <span className="w-26">100</span>
            <span className="w-26">100</span>
            <span className="w-26">100</span>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
