import React from "react";
import { getUserAccounts } from "../actions";
import { AccountCard } from "./account-card";

export default async function AccountsGroup() {
  const accounts = await getUserAccounts();
  if (!accounts || accounts.length === 0) {
    return <p className="text-muted-foreground text-sm">No accounts found.</p>;
  }

  return (
    <>
      {accounts.map((item) => (
        <AccountCard
          id={item.id}
          key={item.id}
          name={item.name}
          balance={item.amount}
          accountType={item.type}
        />
      ))}
    </>
  );
}
