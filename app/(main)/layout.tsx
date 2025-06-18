import React, { ReactNode } from "react";
import Sidebar from "@/components/sidebar";
import MobileBottomNavbar from "@/components/mobilenavbar";

type Props = { children: ReactNode };

export default async function Layout({ children }: Props) {
  return (
    <div className="flex gap-10">
      <Sidebar />
      {/* <MobileBottomNavbar /> */}
      <main className="flex-grow mx-auto h-screen relative p-5">
        {children}
      </main>
    </div>
  );
}
