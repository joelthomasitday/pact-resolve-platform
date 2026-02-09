"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, UserRole } from "@/lib/auth/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  updateUser: (newUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for session in cookies/memory
    const checkAuth = async () => {
      try {
        const storedToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("admin_token="))
          ?.split("=")[1];

        const storedUser = localStorage.getItem("admin_user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
           // If we're on an admin page and not logged in, redirect will be handled by layout/middleware
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    // Setting cookie for middleware access
    // We use a regular cookie here because we're on the client
    // In a real prod app with backend access, the login API would set an HttpOnly cookie
    document.cookie = `admin_token=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}; same-site=strict`;
    localStorage.setItem("admin_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("admin_user", JSON.stringify(newUser));
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        isAdmin,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
