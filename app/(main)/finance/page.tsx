import React from "react";
import { CirclePlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {};

export default function Page({}: Props) {
  return (
    <div>
      <TotalAmountStatus amount={2889} />
      <div className="flex justify-between">
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
