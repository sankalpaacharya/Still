"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Landing = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-white/10">
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500"></div>
              <h1 className="text-xl font-bold text-gradient">fixyourspend</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/signin"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link href="/register">
                <Button
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gradient">Control</span> your spending,
              <span className="block">
                build better <span className="text-gradient">habits</span>
              </span>
            </h1>
            <p className="text-lg text-white/70">
              Track expenses, build saving streaks, and challenge friends to
              spend wisely together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register">
                <Button
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  size="lg"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  Start saving now
                  <ArrowRight
                    className={`ml-2 transition-transform duration-300 ${
                      isHovering ? "translate-x-1" : ""
                    }`}
                    size={18}
                  />
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/20 hover:bg-white/10"
                >
                  Explore dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="glass-card p-1 relative">
            <div className="absolute -top-6 -right-6 h-32 w-32 bg-purple-500/20 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-6 -left-6 h-32 w-32 bg-blue-500/20 blur-3xl rounded-full"></div>
            <AspectRatio
              ratio={16 / 9}
              className="bg-black/40 rounded-lg overflow-hidden"
            >
              <img
                src="https://placehold.co/1280x720/1a1a1a/6c47ff?text=SaveSmart+Dashboard"
                alt="SaveSmart Dashboard Preview"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Landing;
