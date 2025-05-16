import React from "react";
import { Button } from "@/components/ui/button";

type Props = {};

export default function Page({}: Props) {
  return (
    <div>
      <div className="flex justify-center">
        <div className="p-4 bg-green-700 rounded-md shadow-2xl flex w-72 justify-between">
          <div>
            <h2 className="text-3xl font-bold">₹7392</h2>
            <p className="text-sm">Ready Assign</p>
          </div>
          <Button className="shadow-xl cursor-pointer">Assign</Button>
        </div>
      </div>
      <h1>this is my fiance managing app</h1>
    </div>
  );
}
