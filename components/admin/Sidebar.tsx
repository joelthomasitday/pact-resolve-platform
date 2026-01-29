"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Newspaper, 
  Users, 
  Handshake, 
  Calendar, 
  Settings, 
  Library, 
  History, 
  LogOut,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard Overview", href: "/admin", adminOnly: false },
  { icon: ImageIcon, label: "Hero Slides", href: "/admin/hero-slides", adminOnly: false },
  { icon: Newspaper, label: "News", href: "/admin/news", adminOnly: false },
  { icon: Users, label: "Panel Members", href: "/admin/panel-members", adminOnly: false },
  { icon: Handshake, label: "Partners", href: "/admin/partners", adminOnly: false },
  { icon: Calendar, label: "Events", href: "/admin/events", adminOnly: false },
  { icon: Library, label: "Media Library", href: "/admin/media-library", adminOnly: false },
  { icon: Settings, label: "Global Settings", href: "/admin/global-settings", adminOnly: true },
  { icon: History, label: "Audit Logs", href: "/admin/audit-logs", adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  return (
    <aside className="w-72 bg-navy-950 text-white h-[calc(100vh-5rem)] fixed left-0 top-20 z-40 flex flex-col shadow-2xl overflow-y-auto border-r border-white/5">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
          <ShieldCheck className="w-6 h-6 text-navy-950" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">PACT Admin</h2>
          <p className="text-[10px] uppercase tracking-widest text-accent/80 font-semibold">Management Suite</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-accent/10 text-accent font-semibold" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-accent" : "text-slate-500 group-hover:text-white"
              )} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <div className="absolute right-2 w-1 h-5 bg-accent rounded-full animate-in fade-in zoom-in duration-300" />
              )}
              {!isActive && (
                <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-white/5 rounded-2xl p-4 mb-4 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent to-accent/60 flex items-center justify-center text-navy-950 font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{user?.role || "Administrator"}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-3 px-3 h-10"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>
        <p className="text-[10px] text-center text-slate-500">
          PACT v1.0.0 &bull; &copy; {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
}
