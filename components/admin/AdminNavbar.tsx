"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowLeft, LogOut, User, Bell, Search } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function AdminNavbar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="h-20 bg-navy-950 border-b border-white/10 px-8 flex items-center justify-between z-50 sticky top-0">
      <div className="flex items-center gap-8">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-0 -rotate-6 transition-transform duration-300">
            <ShieldCheck className="w-6 h-6 text-navy-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-tight text-xl leading-none">PACT Admin</span>
            <span className="text-[9px] text-accent uppercase tracking-widest font-black mt-1">Management Suite</span>
          </div>
        </Link>

        {user && (
          <>
            <div className="hidden md:flex items-center gap-1 ml-4 pt-1">
               <Link href="/" className="text-white/60 hover:text-white transition-colors text-xs font-semibold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5">
                  <ArrowLeft className="w-3 h-3" />
                  Public Website
               </Link>
            </div>
            
            <div className="hidden lg:flex items-center ml-8 max-w-xs w-64 relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-accent transition-colors" />
               <input 
                  placeholder="Universal search..." 
                  className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white w-full focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
               />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!user ? (
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-accent hover:bg-white/5 gap-2 rounded-xl">
              <ArrowLeft className="w-4 h-4" />
              Return to Website
            </Button>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" className="text-white/60 hover:text-white rounded-full relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-navy-950" />
             </Button>

             <div className="w-px h-6 bg-white/10 mx-2" />

             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 px-2 hover:bg-white/5 rounded-xl transition-all">
                    <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-navy-950 font-bold shadow-md">
                      {user.name.charAt(0)}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-white leading-none">{user.name}</p>
                      <p className="text-[10px] text-white/50 mt-1 uppercase tracking-tighter">{user.role}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 p-2 rounded-xl bg-navy-900 border-white/10 text-white shadow-2xl">
                   <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg py-2 hover:bg-white/5 focus:bg-white/5 focus:text-white">
                      <User className="w-4 h-4 text-accent" />
                      <span>Profile Settings</span>
                   </DropdownMenuItem>
                   <div className="h-px bg-white/10 my-1" />
                   <DropdownMenuItem 
                      onClick={logout}
                      className="cursor-pointer gap-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 focus:text-red-300 focus:bg-red-400/10 rounded-lg py-2"
                   >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                   </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
}
