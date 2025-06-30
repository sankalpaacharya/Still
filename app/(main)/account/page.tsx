import React from "react";
import AddAccountModal from "@/features/account/add-account-modal";
import AccountsGroup from "@/features/account/component/accounts-group";

export default function Page() {
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

      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 md:gap-0">
        <AccountsGroup />
        <AddAccountModal />
      </div>
    </div>
  );
}
