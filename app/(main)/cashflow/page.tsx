import React from "react";
import DataTable from "@/features/cashflow/components/data-table";
import { columns, Expense } from "@/features/cashflow/components/columns";

export async function getData(): Promise<Expense[]> {
  return [
    { amount: 20, category: "gym", description: "random", date: "jun 20" },
  ];
}

export default async function Page() {
  const data = await getData();
  return (
    <div className="">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
