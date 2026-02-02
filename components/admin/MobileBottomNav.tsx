"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Home, 
  Calendar, 
  Handshake, 
  Library,
  MoreVertical
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/context/SidebarContext";

const navItems = [
  { icon: LayoutDashboard, label: "Stats", href: "/admin" },
  { icon: Home, label: "Home", href: "/admin/home-page" },
  { icon: Calendar, label: "Events", href: "/admin/events" },
  { icon: Handshake, label: "Mediation", href: "/admin/mediation" },
  { icon: Library, label: "Media", href: "/admin/media-library" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { toggle } = useSidebar();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-navy-950/5 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] pb-safe">
      <nav className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative",
                isActive 
                  ? "text-accent" 
                  : "text-navy-950/40 hover:text-navy-950/60"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-accent rounded-b-full shadow-[0_2px_10px_rgba(191,154,102,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className={cn("w-5 h-5", isActive ? "text-accent" : "text-navy-950/50")} />
              <span className="text-[9px] mt-1 font-bold uppercase tracking-[0.05em]">{item.label}</span>
            </Link>
          );
        })}
        
        <button
          onClick={toggle}
          className="flex flex-col items-center justify-center flex-1 h-full text-navy-950/40 hover:text-navy-950/60 transition-all"
        >
          <MoreVertical className="w-5 h-5 text-navy-950/50" />
          <span className="text-[9px] mt-1 font-bold uppercase tracking-[0.05em]">More</span>
        </button>
      </nav>
    </div>
  );
}
