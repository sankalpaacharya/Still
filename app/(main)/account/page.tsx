import React from "react";
import { AccountCard } from "@/features/account/component/account-card";
import AddAccountModal from "@/features/account/add-account-modal";

type Props = {};

export default function Page({}: Props) {
  return (
    <div className="">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <h2 className="text-3xl font-bold text-gradient capitalize">
              Your Accounts
            </h2>
          </div>
          <p className="mt-1 text-muted-foreground">
            manage all your accounts setting
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-10">
        <AccountCard name="SBI Bank" accountType="investment" balance={200} />
        <AccountCard name="SBI Bank" accountType="savings" balance={200} />
        <AddAccountModal />
      </div>
    </div>
  );
}
