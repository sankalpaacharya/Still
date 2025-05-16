import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {};

export default function AddAccountModal({}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex flex-col cursor-pointer items-center justify-center  p-6 border-2 border-dashed border-white/20 rounded-xl transition-all hover:bg-white/5">
          <div className="p-4 rounded-full bg-white/10 mb-4">
            <Plus className="h-6 w-6" />
          </div>
          <p className="text-lg font-medium">Add New Account</p>
          <p className="text-sm text-muted-foreground mt-2">
            Track another financial account
          </p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-gradient">Add new Account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-3">
          <Input type="text" placeholder="Account Name" />
          <Input type="number" placeholder="Balance" />
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Account Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Accounts</SelectLabel>
                <SelectItem value="apple">Savings</SelectItem>
                <SelectItem value="banana">Investments</SelectItem>
                <SelectItem value="blueberry">Credit</SelectItem>
                <SelectItem value="grapes">Debit</SelectItem>
                <SelectItem value="pineapple">Loans</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button type="submit" className="bg-purple-400 hover:bg-purple-500">
            Add Account
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
