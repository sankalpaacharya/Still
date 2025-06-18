"use client";
import { Home, PieChart, Bell, MessageCircle, Users, User } from "lucide-react";
import { useEffect, useState } from "react";
import { initBudgetStoreSync, hydrateBudgetStore } from "@/lib/zustand-sync";

const MobileBottomNavbar = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const navItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "finance", icon: PieChart, label: "Finance" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "chat", icon: MessageCircle, label: "Chat" },
    { id: "friends", icon: Users, label: "Friends" },
    { id: "account", icon: User, label: "Account" },
  ];
  useEffect(() => {
    const unsub = initBudgetStoreSync();

    return () => unsub();
  }, []);

  useEffect(() => {
    const hydarate = async () => {
      await hydrateBudgetStore();
    };
    hydarate();
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/10 px-4 pb-6 pt-3 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white/10 text-white scale-110"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className={`relative ${isActive ? "animate-pulse" : ""}`}>
                <IconComponent
                  className={`w-5 h-5 ${isActive ? "drop-shadow-lg" : ""}`}
                />
                {isActive && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur opacity-75" />
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNavbar;
