"use client";

import React from "react";
import { 
  ShieldCheck, 
  FileText, 
  Scale, 
  ArrowRight,
  Eye,
  Database,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { DashboardSectionCard } from "@/components/admin/DashboardSectionCard";
import { FadeInUp, StaggerContainer } from "@/components/motion-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/AuthContext";
import { toast } from "sonner";

const LEGAL_SECTIONS = [
  {
    title: "Privacy Policy",
    description: "Manage how you collect, use, and protect user data.",
    icon: ShieldCheck,
    link: "/admin/legal-pages/privacy",
    color: "text-emerald-600",
    bg: "bg-emerald-50/50"
  },
  {
    title: "Terms of Service",
    description: "Manage the rules, requirements, and legal binding of your platform.",
    icon: Scale,
    link: "/admin/legal-pages/terms",
    color: "text-blue-600",
    bg: "bg-blue-50/50"
  }
];

export default function LegalPagesDashboard() {
  const { token, isAdmin } = useAuth();
  const [isSeeding, setIsSeeding] = React.useState(false);
  const [hasSeeded, setHasSeeded] = React.useState(false);

  const handleSeedData = async () => {
    if (!confirm("This will overwrite existing Privacy and Terms content with default data. Continue?")) {
      return;
    }
    
    setIsSeeding(true);
    try {
      const response = await fetch("/api/content/legal-pages/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success(`Legal pages seeded! ${result.count || 0} pages ready.`);
        setHasSeeded(true);
      } else {
        toast.error(result.error || "Failed to seed data");
      }
    } catch (error: any) {
      console.error("Legal seed error:", error);
      toast.error("An error occurred while seeding data");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Header Section */}
      <FadeInUp className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold mb-1">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase tracking-[0.2em]">Legal & Compliance</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Legal Pages
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
            Manage the legal framework of PACT, including privacy policies and terms of service.
          </p>
        </div>
        
        {isAdmin && (
          <Button 
            onClick={handleSeedData}
            disabled={isSeeding || hasSeeded}
            variant={hasSeeded ? "outline" : "default"}
            className="rounded-xl px-6 shadow-lg h-12"
          >
            {isSeeding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Seeding...
              </>
            ) : hasSeeded ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                Data Indexed
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Seed Default Content
              </>
            )}
          </Button>
        )}
      </FadeInUp>

      {/* Sections Grid */}
      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl">
        {LEGAL_SECTIONS.map((section, i) => (
          <DashboardSectionCard 
            key={i}
            title={section.title}
            description={section.description}
            icon={<section.icon className={cn("h-8 w-8", section.color)} />}
            link={section.link}
            color={section.color}
            bg={section.bg}
          />
        ))}
      </StaggerContainer>

      {/* Bottom Footer Section */}
      <FadeInUp delay={0.4} className="mt-6 p-10 bg-navy-950 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative group">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gold-400 animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white/90">Legal Status</span>
             </div>
             <h3 className="text-2xl font-bold text-white tracking-tight">Need to Preview?</h3>
             <p className="text-white/60 text-sm max-w-xl leading-relaxed">
                Check how your legal pages look to the public. Compliance is key to professional excellence.
             </p>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" target="_blank">
              <Button size="lg" className="rounded-full px-6 bg-white/10 text-white hover:bg-white hover:text-navy-950 border border-white/20 font-bold transition-all group/btn">
                <Eye className="w-4 h-4 mr-2" />
                Preview Privacy
              </Button>
            </Link>
            <Link href="/terms" target="_blank">
              <Button size="lg" className="rounded-full px-6 bg-white text-navy-950 hover:bg-white/90 font-bold transition-all hover:scale-105 active:scale-95 group/btn">
                Preview Terms
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-gold-500/20 transition-all pointer-events-none" />
      </FadeInUp>
    </div>
  );
}
