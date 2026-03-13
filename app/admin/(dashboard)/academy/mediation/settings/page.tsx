"use client";

import React, { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Image as ImageIcon,
  Mail,
  Type,
  Layout,
  Plus,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useAuth } from "@/lib/context/AuthContext";
import { AcademyPageSettings } from "@/lib/db/schemas";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";

export default function MediationSettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<AcademyPageSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/content/academy/page-settings?program=mediation&t=${Date.now()}`);
      const result = await res.json();
      if (result.success && result.data) {
        setSettings(result.data);
      } else {
        toast.error("Failed to fetch settings. Make sure data is seeded.");
      }
    } catch (error) {
      toast.error("Error fetching settings");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    if (!settings) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/content/academy/page-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Settings updated successfully");
      } else {
        toast.error(result.error || "Failed to update settings");
      }
    } catch (error) {
      toast.error("Error updating settings");
    } finally {
      setIsSaving(false);
    }
  }

  const handleAddFeature = () => {
    if (!settings) return;
    const newFeatures = [...(settings.trainingFeatures || []), { title: "" }];
    setSettings({ ...settings, trainingFeatures: newFeatures });
  };

  const handleRemoveFeature = (index: number) => {
    if (!settings) return;
    const newFeatures = settings.trainingFeatures.filter((_, i) => i !== index);
    setSettings({ ...settings, trainingFeatures: newFeatures });
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (!settings) return;
    const newFeatures = [...settings.trainingFeatures];
    newFeatures[index].title = value;
    setSettings({ ...settings, trainingFeatures: newFeatures });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">No settings found for Mediation.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Header */}
      <FadeInUp className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-3">
          <Link href="/admin/academy/mediation" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-accent hover:text-accent/80 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Mediation
          </Link>
          <h1 className="text-3xl font-bold text-navy-950">Mediation Page Settings</h1>
          <p className="text-muted-foreground">Configure global content for the mediation academy page.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-navy-950 hover:bg-navy-900 text-white rounded-xl px-8 shadow-lg shadow-navy-950/20"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </FadeInUp>

      <StaggerContainer className="grid gap-8 lg:grid-cols-2">
        {/* Hero Section */}
        <StaggerItem>
          <Card className="rounded-4xl border-none shadow-sm h-full">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Layout className="w-5 h-5" />
                </div>
                <CardTitle>Hero Section</CardTitle>
              </div>
              <CardDescription>Main title, subtitle, and description at the top of the page.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label>Hero Title</Label>
                <Input 
                  value={settings.heroTitle} 
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  placeholder="MEDIATION"
                />
              </div>
              <div className="space-y-2">
                <Label>Hero Subtitle</Label>
                <Input 
                  value={settings.heroSubtitle} 
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  placeholder="Academy / Mediation"
                />
              </div>
              <div className="space-y-2">
                <Label>Hero Description</Label>
                <Textarea 
                  value={settings.heroDescription} 
                  onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                  placeholder="Description text..."
                  rows={4}
                />
              </div>
              <ImageUpload 
                label="Hero Background Image"
                description="This background image appears behind the hero text."
                value={settings.heroImage}
                onChange={(url) => setSettings({ ...settings, heroImage: url })}
              />
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Corporate Training Section */}
        <StaggerItem>
          <Card className="rounded-4xl border-none shadow-sm h-full border-2 border-accent/20">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gold-50 text-gold-600">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <CardTitle className="text-gold-700">Train Your Team Section</CardTitle>
              </div>
              <CardDescription>Specifically the corporate training image and content you requested to edit.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input 
                  value={settings.trainingTitle} 
                  onChange={(e) => setSettings({ ...settings, trainingTitle: e.target.value })}
                  placeholder="Train Your Team"
                />
              </div>
              <div className="space-y-2">
                <Label>Section Description</Label>
                <Textarea 
                  value={settings.trainingDescription} 
                  onChange={(e) => setSettings({ ...settings, trainingDescription: e.target.value })}
                  placeholder="Corporate training description..."
                  rows={4}
                />
              </div>
              <ImageUpload 
                label="Training Section Image (The Right Side Img)"
                description="This is the image on the right side of the 'Train Your Team' section."
                value={settings.trainingImage}
                onChange={(url) => setSettings({ ...settings, trainingImage: url })}
              />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Training Features</Label>
                  <Button variant="outline" size="sm" onClick={handleAddFeature} className="h-8 rounded-lg">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {settings.trainingFeatures?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={feature.title} 
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="Feature title"
                        className="h-9"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveFeature(index)}
                        className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Contact Info */}
        <StaggerItem>
          <Card className="rounded-4xl border-none shadow-sm">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-navy-50 text-navy-600">
                  <Mail className="w-5 h-5" />
                </div>
                <CardTitle>Inquiry Settings</CardTitle>
              </div>
              <CardDescription>Contact email for academy inquiries.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input 
                  value={settings.contactEmail} 
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="official@thepact.in"
                />
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Save Button Floating */}
      <FadeInUp delay={0.5} className="flex justify-end pt-4">
         <Button 
          onClick={handleSave} 
          disabled={isSaving}
          size="lg"
          className="bg-navy-950 hover:bg-navy-900 text-white rounded-full px-12 h-14 text-base font-bold shadow-2xl shadow-navy-950/20 active:scale-95 transition-all"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save All Settings
        </Button>
      </FadeInUp>
    </div>
  );
}
