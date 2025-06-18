"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initBudgetStoreSync, hydrateBudgetStore } from "@/lib/zustand-sync";
import {
  Home as HomeIcon,
  Menu,
  DollarSign,
  User,
  Sparkles,
  LogOut,
  CreditCard,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  { icon: Bell, label: "Notification", href: "/notification" },
  {
    icon: DollarSign,
    label: "Finance",
    href: "/finance",
  },
  {
    icon: Sparkles,
    label: "Chat",
    href: "/chat",
  },
  {
    icon: User,
    label: "Friends",
    href: "/friends",
  },
  { icon: CreditCard, label: "Account", href: "/account" },
];

interface User {
  profile: string;
  name: string;
}

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const location = usePathname();
  const [user, setUser] = useState<User>();
  const router = useRouter();
  useEffect(() => {
    console.log("is this called sidebar");
    const unsub = initBudgetStoreSync();

    return () => unsub();
  }, []);
  useEffect(() => {
    const getUser = async () => {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log(error);
      }
      setUser({
        profile: data.user?.user_metadata.avatar_url,
        name: data.user?.user_metadata.full_name,
      });
    };
    getUser();
  }, []);

  useEffect(() => {
    const hydarate = async () => {
      await hydrateBudgetStore();
    };
    hydarate();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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

      <Button
        onClick={handleLogout}
        variant="ghost"
        className={cn(
          "w-full mt-3 flex items-center justify-start text-muted-foreground hover:text-white hover:bg-white/5",
          !expanded && "justify-center"
        )}
      >
        <LogOut size={18} />
        <span
          className={cn(
            "ml-2 text-sm whitespace-nowrap transition-all duration-300 overflow-hidden",
            expanded ? "w-24" : "w-0 ml-0"
          )}
        >
          Logout
        </span>
      </Button>
      <div className="p-4 border-t border-white/10">
        <div
          className={cn(
            "flex items-center gap-3",
            !expanded && "justify-center"
          )}
        >
          <Avatar>
            <AvatarImage src={user?.profile} alt="@shadcn" />
            <AvatarFallback>fYS</AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              expanded ? "w-36" : "w-0"
            )}
          >
            <p className="text-sm font-medium whitespace-nowrap">
              {user?.name}
            </p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              8 day streak
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
