"use client";
import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Home as HomeIcon,
  Menu,
  House,
  DollarSign,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    icon: HomeIcon,
    label: "Dashboard",
    href: "/dashboard",
  },

  {
    icon: DollarSign,
    label: "Finance",
    href: "/finance",
  },
  {
    icon: Sparkles,
    label: "Sanku",
    href: "/house",
  },
  {
    icon: User,
    label: "Friends",
    href: "/profile/settings",
  },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const location = usePathname();

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-background border-r border-white/10 transition-all duration-300 flex flex-col",
        expanded ? "w-64" : "w-16"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            expanded ? "w-36" : "w-0"
          )}
        >
          <Link href="/" className="font-bold whitespace-nowrap">
            <span className="text-gradient">fixyourspend</span>
          </Link>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="h-8 w-8"
        >
          <Menu size={18} />
        </Button>
      </div>
      <div className="flex flex-col gap-1 p-2 flex-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center p-2 rounded-md transition-colors hover:bg-white/5",
                isActive && "bg-white/10",
                !expanded && "justify-center"
              )}
            >
              <IconComponent
                size={20}
                className={cn(
                  isActive ? "text-indigo-400" : "text-muted-foreground"
                )}
              />
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 whitespace-nowrap",
                  expanded ? "w-40 ml-3" : "w-0 ml-0"
                )}
              >
                <span
                  className={cn(
                    "text-sm",
                    isActive ? "text-white" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-white/10">
        <div
          className={cn(
            "flex items-center gap-3",
            !expanded && "justify-center"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <span className="font-bold text-sm">JS</span>
          </div>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              expanded ? "w-36" : "w-0"
            )}
          >
            <p className="text-sm font-medium whitespace-nowrap">John Smith</p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              8 day streak
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
