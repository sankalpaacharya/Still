import React from "react";
import { Button } from "./ui/button";
import { BicepsFlexed } from "lucide-react";
import { Instrument_Serif } from "next/font/google";
import TaskCard from "./taskcard";
import MessageBubble from "./message-bubble";
import Link from "next/link";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

export default function Hero() {
  return (
    <main className="wrapper flex justify-center py-20 flex-col items-center space-y-5 relative">
      <p className="border border-gray-800 px-3 rounded-full shadow-xl inline-flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-700"></span>
        Still is now available
      </p>
      <div>
        <h2 className="text-5xl md:text-6xl font-extrabold text-center">
          Your AI that tracks spending
          <br />
          <span className={`${instrumentSerif.className}`}>
            and fix your unnecessary expenses
          </span>
        </h2>
      </div>
      <p className="text-gray-400 px-20 text-center md:px-0">
        Get more done with less effort, in a way that works for you.
      </p>
      <MessageBubble
        message="You spend like money respawns 💸"
        className="absolute top-30 rotate-10 hidden lg:block"
      />
      <MessageBubble
        message="You treat money like it's a rumor, gone in seconds."
        className="absolute top-70 rotate-5 hidden lg:block"
      />

      <MessageBubble
        message="Bank account: 0. Self-respect: also 0"
        className="absolute top-30 right-0 rotate-10 hidden lg:block"
      />

      <MessageBubble
        message="Even broke people judging you rn 😭"
        className="absolute top-70 right-0 rotate-5 hidden lg:block"
      />
      <div className="space-y-2 flex flex-col items-center">
        <Link href="/login">
          <Button className="cursor-pointer font-bold mt-5 py-6 bg-indigo-700 hover:bg-indigo-800 text-white">
            <BicepsFlexed />
            Try Still for free
          </Button>
        </Link>
        <p className="text-gray-400 text-sm">used by 100k+ users</p>
        <div className="gradient-bg absolute top-[30rem]" />
      </div>
      <div className="p-5">
        <TaskCard></TaskCard>
      </div>
    </main>
  );
}
