import React, { ReactNode } from "react";
import Sidebar from "@/components/sidebar";

type Props = { children: ReactNode };

export default function Layout({ children }: Props) {
  return (
    <div className="flex gap-10">
      <Sidebar />
      <main className="flex-grow mx-auto p-5 h-screen">{children}</main>
    </div>
  );
}
