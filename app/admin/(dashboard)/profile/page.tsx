"use client";

import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Shield, 
  Lock, 
  Calendar, 
  Camera,
  CheckCircle2,
  AlertCircle,
  LogOut,
  MailIcon,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FadeInUp, StaggerContainer } from "@/components/motion-wrapper";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { user, isAdmin, logout, token, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      updateUser(data.user);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.password) {
      return toast.error("Please enter a new password");
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      return toast.error("Passwords do not match");
    }


    setIsPasswordLoading(true);
    
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          password: passwordData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      toast.success("Password updated successfully!");
      setPasswordData({ password: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header section with cover effect */}
      <FadeInUp className="relative group">
        <div className="h-48 w-full rounded-[2.5rem] bg-linear-to-r from-navy-950 via-navy-900 to-accent/20 overflow-hidden relative shadow-2xl">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
           <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse" />
        </div>
        
        <div className="px-8 -mt-20 relative z-10 flex flex-col md:flex-row items-end gap-6">
              <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl border border-slate-100">
                 <div className="w-full h-full rounded-4xl bg-accent/10 flex items-center justify-center text-5xl font-black text-accent shadow-inner">
                    {user.name.charAt(0)}
                 </div>
              </div>
              <button className="absolute bottom-2 right-2 w-10 h-10 rounded-2xl bg-navy-950 text-white flex items-center justify-center shadow-xl border-4 border-white hover:scale-110 active:scale-95 transition-all group-hover/avatar:bg-accent group-hover/avatar:text-navy-950">
                 <Camera className="w-4 h-4" />
              </button>
           </div>
           
           <div className="pb-4 flex-1">
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-4xl font-black text-navy-950 tracking-tight">{user.name}</h1>
                 <Badge className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 font-black tracking-widest uppercase py-1 px-3 rounded-lg">
                    {user.role}
                 </Badge>
              </div>
           </div>

           <div className="pb-4 flex gap-3">
              <Button 
                onClick={() => setIsEditing(!isEditing)} 
                variant={isEditing ? "ghost" : "default"}
                className="rounded-2xl px-8 h-12 font-bold transition-all shadow-lg active:scale-95"
              >
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </Button>
           </div>
      </FadeInUp>

      <StaggerContainer className="grid lg:grid-cols-3 gap-8 mt-4">
         {/* Account Info Form */}
         <FadeInUp className="lg:col-span-2 space-y-8">
            <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-navy-950/5 overflow-hidden">
               <CardHeader className="p-8 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <UserCheck className="w-5 h-5" />
                     </div>
                     <div>
                        <CardTitle className="text-xl font-bold text-navy-950">Account Information</CardTitle>
                        <CardDescription className="text-navy-950/40 font-medium">Update your basic account details and identity.</CardDescription>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-8">
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-black text-navy-950 uppercase tracking-widest ml-1">Full Name</label>
                           <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-950/20 group-focus-within:text-accent transition-colors" />
                              <Input 
                                disabled={!isEditing}
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="h-14 pl-12 rounded-2xl bg-slate-50 border-transparent focus:border-accent focus:bg-white transition-all font-bold placeholder:text-navy-950/20"
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-navy-950 uppercase tracking-widest ml-1">Email Address</label>
                           <div className="relative group">
                              <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-950/20 group-focus-within:text-accent transition-colors" />
                              <Input 
                                disabled={!isEditing}
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="h-14 pl-12 rounded-2xl bg-slate-50 border-transparent focus:border-accent focus:bg-white transition-all font-bold placeholder:text-navy-950/20"
                              />
                           </div>
                        </div>
                     </div>
                     
                     {isEditing && (
                        <div className="flex justify-end pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                           <Button 
                             type="submit" 
                             disabled={isLoading}
                             className="rounded-2xl px-12 h-14 bg-navy-950 hover:bg-navy-900 text-white font-bold shadow-2xl active:scale-95 transition-all"
                           >
                              {isLoading ? "Saving Changes..." : "Save Profile Changes"}
                           </Button>
                        </div>
                     )}
                  </form>
               </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-navy-950/5 overflow-hidden">
               <CardHeader className="p-8 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                        <Lock className="w-5 h-5" />
                     </div>
                     <div>
                        <CardTitle className="text-xl font-bold text-navy-950">Update Password</CardTitle>
                        <CardDescription className="text-navy-950/40 font-medium">Ensure your account stays secure with a strong password.</CardDescription>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-8">
                  <form onSubmit={handleUpdatePassword}>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-black text-navy-950 uppercase tracking-widest ml-1">New Password</label>
                           <Input 
                             type="password"
                             placeholder="••••••••"
                             value={passwordData.password}
                             onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                             className="h-14 rounded-2xl bg-slate-50 border-transparent focus:border-accent focus:bg-white transition-all font-bold"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-navy-950 uppercase tracking-widest ml-1">Confirm Password</label>
                           <Input 
                             type="password"
                             placeholder="••••••••"
                             value={passwordData.confirmPassword}
                             onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                             className={cn(
                               "h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white transition-all font-bold",
                               passwordData.confirmPassword && passwordData.password !== passwordData.confirmPassword 
                                 ? "border-red-500 focus:border-red-500 text-red-500" 
                                 : "focus:border-accent"
                             )}
                           />
                           {passwordData.confirmPassword && passwordData.password !== passwordData.confirmPassword && (
                             <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
                               Passwords do not match
                             </p>
                           )}
                        </div>
                     </div>
                     <div className="flex justify-end mt-8">
                        <Button 
                          type="submit"
                          disabled={isPasswordLoading}
                          className="rounded-2xl px-12 h-14 bg-accent hover:bg-accent/90 text-navy-950 font-bold shadow-lg shadow-accent/10 active:scale-95 transition-all"
                        >
                           {isPasswordLoading ? "Updating..." : "Update Password"}
                        </Button>
                     </div>
                  </form>
               </CardContent>
            </Card>
         </FadeInUp>

         {/* Sidebar stats/actions */}
         <FadeInUp delay={0.2} className="space-y-8">
            <Card className="rounded-[2.5rem] bg-navy-950 text-white border-none shadow-2xl overflow-hidden relative group">
               <CardContent className="p-10 relative z-10">
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-accent">Security Status</p>
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center border border-accent/20">
                              <Shield className="w-6 h-6 text-accent" />
                           </div>
                           <h3 className="text-2xl font-bold">2FA Enabled</h3>
                        </div>
                     </div>
                     
                     <div className="h-px bg-white/5" />
                     
                     <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase opacity-40">Session</p>
                           <p className="text-xl font-bold text-emerald-400">Active</p>
                        </div>
                        <div className="space-y-1 border-l border-white/5">
                           <p className="text-[10px] font-black uppercase opacity-40">Location</p>
                           <p className="text-xl font-bold">London, UK</p>
                        </div>
                     </div>

                     <Button 
                       onClick={logout}
                       variant="outline" 
                       className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-red-500 hover:border-red-500 text-white font-bold transition-all group/btn"
                     >
                        <LogOut className="w-4 h-4 mr-2 group-hover/btn:-translate-x-1 transition-transform" />
                        Sign Out from All Devices
                     </Button>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-accent/10 transition-all pointer-events-none" />
               </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-navy-950/5 overflow-hidden">
               <CardHeader className="p-8 border-b border-slate-50">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-navy-950/20 mb-2">Platform Access</p>
                  <CardTitle className="text-xl font-bold text-navy-950">Permissions</CardTitle>
               </CardHeader>
               <CardContent className="p-8">
                  <div className="space-y-6">
                     {[
                       { label: 'Edit CMS Content', sub: 'Homepage, Events, Mediation', active: true },
                       { label: 'Manage Academy', sub: 'Courses, Modules, Faculty', active: true },
                       { label: 'Global Settings', sub: 'Site branding, SEO', active: isAdmin },
                       { label: 'User Management', sub: 'Create admin accounts', active: isAdmin }
                     ].map((perm, i) => (
                       <div key={i} className={`flex items-start gap-4 ${!perm.active ? 'opacity-30 grayscale' : ''}`}>
                          <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${perm.active ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                             <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-navy-950">{perm.label}</p>
                             <p className="text-[10px] uppercase font-bold text-navy-950/40 mt-1">{perm.sub}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </FadeInUp>
      </StaggerContainer>
    </div>
  );
}
