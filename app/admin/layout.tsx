import { AuthProvider } from "@/lib/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminNavbar />
      {children}
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
