import React from "react";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const navLinks = [
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Features",
    href: "/features",
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
  {
    name: "FAQ's",
    href: "/faq",
  },
];

export default function Navbar() {
  return (
    <>
      <nav className="wrapper p-5 py-7 flex justify-between items-center">
        <h2 className="flex items-center text-3xl">🎯 Still</h2>
        <div className="flex gap-4 items-center">
          <div className="gap-4 items-center hidden md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.name}
              </Link>
            ))}
          </div>
          <Link href={"/login"}>
            <Button className="cursor-pointer bg-indigo-700 hover:bg-indigo-800 text-white">
              Get started
            </Button>
          </Link>
        </div>
      </nav>
      <Separator />
    </>
  );
}
