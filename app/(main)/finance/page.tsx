"use client";
import { CirclePlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableHeader,
  TableFooter,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Blinds } from "lucide-react";
import { Plus } from "lucide-react";
type Props = {};

export default function Page({}: Props) {
  return (
    <div className="border">
      <div className="flex w-[65%] justify-center">
        <TotalAmountStatus amount={2889} />
      </div>
      <div className="flex gap-2">
        <BudgetTable />
        <div className="w-[30%]  p-5 rounded-md bg-gray-500/10 h-[40rem]">
          <h2 className="text-md font-semibold">📺 Tv Streaming </h2>
          <div className="mt-1 p-5 rounded-md bg-white/10">Target</div>
        </div>
      </div>
    </div>
  );
}

function TotalAmountStatus({ amount }: { amount: number }) {
  return (
    <div className="flex justify-center mb-6">
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
    <div className="space-y-3 mb-6 flex-1">
      <CategoryGroup />
    </div>
  );
}

function CategoryGroup() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="group hover:no-underline bg-white/10 p-5 rounded-b-none rounded-t-md font-semibold text-lg">
          <span className="flex gap-4 items-center">
            <Blinds size={18} />
            💰 Savings
            <div onClick={(e) => e.stopPropagation()}>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="p-1 rounded-full bg-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                    <Plus size={15} />
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <Input placeholder="New Catgeory" className="mb-4" />
                  <div className="flex gap-2">
                    <Button variant={"secondary"}>Cancel</Button>
                    <Button>Ok</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </span>
        </AccordionTrigger>
        <AccordionContent className="border rounded-md rounded-t-none">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[61%] font-bold text-gray-400 px-5">
                  Category
                </TableHead>
                <TableHead className="w-[13%] font-bold text-gray-400 text-right px-5">
                  Assigned
                </TableHead>
                <TableHead className="w-[13%] font-bold text-gray-400 text-right px-5">
                  Spent
                </TableHead>
                <TableHead className="w-[13%] font-bold text-gray-400 text-right px-5">
                  Available
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="text-md">
                <TableCell className="w-[61%] p-5">
                  Tv, Transportation
                  <Progress value={33} className="mt-2 h-1" />
                </TableCell>
                <TableCell className="w-[13%] text-right p-5">₹500</TableCell>
                <TableCell className="w-[13%] text-right p-5">₹500</TableCell>
                <TableCell className="w-[13%] text-right p-5">₹1000</TableCell>
              </TableRow>
              <TableRow className="text-md">
                <TableCell className="w-[61%] p-5">
                  Tv, Transportation
                  <Progress value={33} className="mt-2 h-1" />
                </TableCell>
                <TableCell className="w-[13%] text-right p-5">₹500</TableCell>
                <TableCell className="w-[13%] text-right p-5">₹500</TableCell>
                <TableCell className="w-[13%] text-right p-5">₹1000</TableCell>
              </TableRow>
              <TableRow className="text-md">
                <TableCell className="w-[61%] p-5">
                  Tv, Transportation
                  <Progress value={33} className="mt-2 h-1" />
                </TableCell>
                <TableCell className="w-[13%] text-right p-5">₹500</TableCell>
                <TableCell className="w-[13%] text-right p-5">₹500</TableCell>
                <TableCell className="w-[13%] text-right p-5">₹1000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
