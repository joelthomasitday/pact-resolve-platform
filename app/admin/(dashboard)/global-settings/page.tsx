"use client";

import React, { useEffect, useState } from "react";
import { 
  Save, 
  Loader2, 
  Settings, 
  Mail, 
  Globe, 
  Info, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/context/AuthContext";

export default function GlobalSettingsPage() {
  const { token, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    footerText: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: ""
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/content/global-settings");
      const result = await response.json();
      if (result.success && result.data) {
        setSettings({
          ...settings,
          ...result.data,
          socialLinks: {
            ...settings.socialLinks,
            ...(result.data.socialLinks || {})
          }
        });
      } else {
        toast.error("Settings not found, starting with defaults.");
      }
    } catch (error) {
      toast.error("Failed to load settings.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("You don't have permission to change these settings.");
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch("/api/content/global-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success("Global settings updated successfully");
      } else {
        toast.error(result.error || "Failed to update settings");
      }
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateSocial = (platform: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-navy-950 flex items-center gap-3">
          <Settings className="w-8 h-8 text-accent" />
          Global Settings
        </h1>
        <p className="text-muted-foreground">Manage core website configurations and contact information.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          {/* General Information */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/30 p-8 border-b">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Info className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">General Information</CardTitle>
              </div>
              <CardDescription>Primary identification details for the PACT platform.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input 
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  placeholder="e.g. PACT Resolve Platform"
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Site Meta Description</Label>
                <Textarea 
                  id="description"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  placeholder="Tell search engines what your site is about..."
                  className="rounded-xl min-h-[100px] resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Official Contact Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="info@pactmediation.com"
                    className="pl-10 rounded-xl h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Presence */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/30 p-8 border-b">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <Globe className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">Social Presence</CardTitle>
              </div>
              <CardDescription>Connect your official social media profiles.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                </Label>
                <Input 
                  value={settings.socialLinks.facebook}
                  onChange={(e) => updateSocial("facebook", e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-sky-500" /> Twitter / X
                </Label>
                <Input 
                  value={settings.socialLinks.twitter}
                  onChange={(e) => updateSocial("twitter", e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-700" /> LinkedIn
                </Label>
                <Input 
                  value={settings.socialLinks.linkedin}
                  onChange={(e) => updateSocial("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-600" /> Instagram
                </Label>
                <Input 
                  value={settings.socialLinks.instagram}
                  onChange={(e) => updateSocial("instagram", e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="rounded-xl h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* Footer & Legal */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/30 p-8 border-b">
              <CardTitle className="text-xl">Footer Content</CardTitle>
              <CardDescription>Copyright texts and bottom-of-page information.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-2">
                <Label htmlFor="footer">Copyright Text</Label>
                <Input 
                  id="footer"
                  value={settings.footerText}
                  onChange={(e) => setSettings(prev => ({ ...prev, footerText: e.target.value }))}
                  placeholder="e.g. © 2025 PACT Resolve Platform. All rights reserved."
                  className="rounded-xl h-11"
                />
              </div>
            </CardContent>
            <CardFooter className="p-8 bg-muted/10 border-t flex justify-end">
              <Button 
                type="submit" 
                className="rounded-xl h-12 px-8 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20"
                disabled={isSaving || !isAdmin}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
