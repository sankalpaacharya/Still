"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { hydrateBudgetStore } from "@/lib/zustand-sync";
import {
  Home as HomeIcon,
  Menu,
  DollarSign,
  User,
  Sparkles,
  LogOut,
  CreditCard,
  BanknoteArrowDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "motion/react";

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
  // { icon: Bell, label: "Notification", href: "/notification" },
  {
    icon: DollarSign,
    label: "Finance",
    href: "/finance",
  },
  {
    icon: BanknoteArrowDown,
    label: "Cash Flow",
    href: "/cashflow",
  },
  {
    icon: Sparkles,
    label: "Chat",
    href: "/chat",
  },

  { icon: CreditCard, label: "Account", href: "/account" },
];

interface User {
  profile: string;
  name: string;
}

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false); // Default to collapsed on mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = usePathname();
  const [user, setUser] = useState<User>();
  const router = useRouter();

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setExpanded(true); // Auto-expand on desktop
        setMobileMenuOpen(false); // Close mobile menu on desktop
      } else {
        setExpanded(false); // Auto-collapse on mobile
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
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
    console.log("fetching the user data");
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

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setExpanded(!expanded);
    }
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  console.log("side bar is render");

  // Mobile Menu Button (only visible on mobile)
  const MobileMenuButton = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="md:hidden fixed top-2 left-2 z-50 h-8 w-8 bg-background/80 backdrop-blur-sm border border-white/10 hover:bg-background"
    >
      {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
    </Button>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside
      className={cn(
        "hidden md:flex h-screen sticky top-0 bg-background border-r border-white/10 transition-all duration-300 flex-col",
        expanded ? "w-64" : "w-16"
      )}
    >
      <SidebarContent />
    </aside>
  );

  const MobileSidebar = () => (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
          />

          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="md:hidden fixed left-0 top-0 h-full w-72 bg-background border-r border-white/10 z-50 flex flex-col"
          >
            <SidebarContent isMobile={true} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  // Sidebar Content Component
  const SidebarContent = ({ isMobile: mobile = false }) => (
    <>
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            expanded || mobile ? "w-36" : "w-0"
          )}
        >
          <Link href="/" className="font-bold whitespace-nowrap">
            <span className="text-gradient">fixyourspend</span>
          </Link>
        </div>
        {!mobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <Menu size={18} />
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-1 p-2 flex-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.href;
          return (
            <motion.span key={item.href} whileTap={{ scale: 0.95 }}>
              <Link
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center p-2 rounded-md transition-colors hover:bg-white/5",
                  isActive && "bg-white/10",
                  !expanded && !mobile && "justify-center"
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
                    expanded || mobile ? "w-40 ml-3" : "w-0 ml-0"
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
            </motion.span>
          );
        })}
      </div>

      <Button
        onClick={handleLogout}
        variant="ghost"
        className={cn(
          "w-full mt-3 flex items-center justify-start text-muted-foreground hover:text-white hover:bg-white/5",
          !expanded && !mobile && "justify-center"
        )}
      >
        <LogOut size={18} />
        <span
          className={cn(
            "ml-2 text-sm whitespace-nowrap transition-all duration-300 overflow-hidden",
            expanded || mobile ? "w-24" : "w-0 ml-0"
          )}
        >
          Logout
        </span>
      </Button>

      <div className="p-4 border-t border-white/10">
        <div
          className={cn(
            "flex items-center gap-3",
            !expanded && !mobile && "justify-center"
          )}
        >
          <Avatar>
            <AvatarImage src={user?.profile} alt="@shadcn" />
            <AvatarFallback>fYS</AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              expanded || mobile ? "w-36" : "w-0"
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
    </>
  );

  return (
    <>
      <MobileMenuButton />
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
