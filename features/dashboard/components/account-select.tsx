"use client";
import { useEffect, useState } from "react";
import { getUserAccounts } from "@/features/account/actions";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  selected: string;
  setSelected: (val: string) => void;
};

type Account = {
  id: string;
  name: string;
};

export function AccountSelect({ selected, setSelected }: Props) {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await getUserAccounts();
        console.log("these are accounts", res);
        setAccounts(res);
        if (res.length > 0 && !selected) {
          setSelected(res[0].id);
        }
      } catch (err) {
        console.error("Error fetching accounts", err);
      } finally {
      }
    };
    fetchAccounts();
  }, []);

  return (
    <Select
      value={selected == "" ? (accounts[0] ? accounts[0].name : "") : selected}
      onValueChange={setSelected}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Account" />
      </SelectTrigger>
      <SelectContent>
        {accounts.map((acc) => (
          <SelectItem key={acc.id} value={acc.id}>
            {acc.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
