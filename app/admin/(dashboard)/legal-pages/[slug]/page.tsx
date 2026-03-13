"use client";

import React, { useEffect, useState } from "react";
import { 
  Save, 
  Loader2, 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/context/AuthContext";
import { FadeInUp } from "@/components/motion-wrapper";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";

interface LegalPageData {
  title: string;
  content: string;
  isActive: boolean;
}

const defaultData: LegalPageData = {
  title: "",
  content: "",
  isActive: true
};

export default function LegalPageEditor() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { token, isAdmin } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<LegalPageData>(defaultData);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPageData();
  }, [slug]);

  async function fetchPageData() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/content/legal-pages?slug=${slug}`);
      const result = await response.json();
      
      if (!result.success) {
        setError(result.error || "Failed to load page data");
        return;
      }
      
      if (result.data) {
        setData({
          title: result.data.title || "",
          content: result.data.content || "",
          isActive: result.data.isActive ?? true
        });
      } else {
        // Initialize with default titles if not found
        setData({
          ...defaultData,
          title: slug === "privacy" ? "Privacy Policy" : "Terms of Service"
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("You don't have permission to perform this action.");
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch("/api/content/legal-pages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          slug,
          ...data
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success("Page updated successfully");
        setHasChanges(false);
      } else {
        toast.error(result.error || "Failed to update page");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof LegalPageData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10 pb-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const pageTitle = slug === "privacy" ? "Privacy Policy" : "Terms of Service";

  return (
    <div className="flex flex-col gap-8 pb-16">
      <FadeInUp className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-1">
        <div className="space-y-2">
          <Link 
            href="/admin/legal-pages"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-2 text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Legal Dashboard
          </Link>
          <div className="flex items-center gap-2 text-primary font-bold mb-1">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase tracking-[0.2em]">Editor</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Edit {pageTitle}
          </h1>
        </div>
        <div className="flex gap-3">
          <Link href={`/${slug}`} target="_blank">
            <Button variant="outline" className="rounded-xl px-5 border-border/40">
              <Eye className="w-4 h-4 mr-2" />
              View Public Page
            </Button>
          </Link>
        </div>
      </FadeInUp>

      {error ? (
        <Card className="border-destructive/30 rounded-3xl shadow-xl">
          <CardContent className="p-10 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-bold text-destructive">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchPageData} variant="outline" className="rounded-full">Try Again</Button>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          <Card className="border-border/40 shadow-sm bg-white rounded-4xl overflow-hidden">
            <CardHeader className="pb-6 pt-8 px-8 border-b border-border/20">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight">Page Content</CardTitle>
                  <CardDescription className="text-sm mt-0.5">
                    Update the title and professional content for your {pageTitle.toLowerCase()}.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Page Display Title
                </Label>
                <Input 
                  id="title"
                  value={data.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder={`e.g. ${pageTitle}`}
                  className="rounded-xl h-12 border-border/60 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="content" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Content (Supports HTML/Markdown)
                  </Label>
                  <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tight bg-slate-100 text-slate-500 rounded-lg">
                    Plain Text / HTML
                  </Badge>
                </div>
                <Textarea 
                  id="content"
                  value={data.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  placeholder="Paste your legal content here..."
                  className="rounded-xl min-h-[600px] font-mono text-sm leading-relaxed border-border/60 focus:border-primary resize-none p-6"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  checked={data.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                />
                <Label htmlFor="isActive" className="text-sm font-medium leading-none cursor-pointer">
                  Mark this page as active and visible to public
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/50">
            <h4 className="font-bold text-navy-950 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Quick Tips
            </h4>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5">
              <li>Use standard paragraphs for general text.</li>
              <li>You can use simple HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, and &lt;li&gt; for formatting.</li>
              <li>Ensure your legal team has reviewed the content before publishing.</li>
            </ul>
          </div>

          {/* Action Bar */}
          <div className="sticky bottom-6 z-10">
            <div className="p-6 bg-navy-950 rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    hasChanges 
                      ? "bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                      : "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]"
                  )} />
                  <div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/90">
                      {hasChanges ? "Unsaved Changes" : "All Changes Saved"}
                    </span>
                    <p className="text-white/50 text-xs mt-0.5">
                      Last edited just now
                    </p>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  className="rounded-full px-8 bg-white text-navy-950 hover:bg-white/90 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                  disabled={isSaving || !isAdmin}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Page
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
