import { AuthProvider } from "@/lib/context/AuthContext";
import { SidebarProvider } from "@/lib/context/SidebarContext";
import { Toaster } from "@/components/ui/sonner";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { MobileBottomNav } from "@/components/admin/MobileBottomNav";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-[#F8FAFC]">
          <AdminNavbar />
          <main className="pb-24">
            {children}
          </main>
          <MobileBottomNav />
        </div>
        <Toaster position="top-right" richColors />
      </SidebarProvider>
    </AuthProvider>
  );
}
