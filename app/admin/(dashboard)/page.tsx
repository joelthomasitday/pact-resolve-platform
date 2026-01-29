"use client";

import React, { useEffect, useState } from "react";
import { 
  Newspaper, 
  Image as ImageIcon, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  MoreVertical,
  ChevronRight,
  Library,
  Settings
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    news: 0,
    slides: 0,
    events: 0,
    loading: true
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch real counts from APIs
        const [newsRes, slidesRes, eventsRes] = await Promise.all([
          fetch("/api/content/news"),
          fetch("/api/content/hero-slides"),
          fetch("/api/content/mci-event")
        ]);

        const [newsData, slidesData, eventsData] = await Promise.all([
          newsRes.json(),
          slidesRes.json(),
          eventsRes.json()
        ]);

        setStats({
          news: newsData.data?.length || 0,
          slides: slidesData.data?.length || 0,
          events: Array.isArray(eventsData.data) ? eventsData.data.length : (eventsData.data ? 1 : 0),
          loading: false
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }

    fetchStats();
  }, []);

  const metrics = [
    {
      title: "Total News Items",
      value: stats.loading ? "..." : stats.news.toString(),
      description: "Active news items",
      icon: Newspaper,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Hero Slides",
      value: stats.loading ? "..." : stats.slides.toString(),
      description: "Homepage carousel items",
      icon: ImageIcon,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "Stable",
      trendUp: true
    },
    {
      title: "Upcoming Events",
      value: stats.loading ? "..." : stats.events.toString(),
      description: "Scheduled championships",
      icon: Calendar,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "+2",
      trendUp: true
    },
    {
      title: "Active Users",
      value: "4",
      description: "Admin & Staff members",
      icon: Clock,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "Online",
      trendUp: true
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-navy-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user?.name || "Admin"}!</h1>
          <p className="text-blue-200 max-w-lg">
            Here's what's happening with the PACT Resolve platform today. You have full control over the website's content and settings.
          </p>
        </div>
        <div className="flex gap-3 z-10">
          <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-xl">
            View Public Site
          </Button>
          <Link href="/admin/news">
            <Button className="bg-accent hover:bg-accent/90 text-navy-950 font-bold rounded-xl shadow-lg border-none shadow-accent/20">
              <Plus className="w-4 h-4 mr-2" />
              Add News Item
            </Button>
          </Link>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mb-10 pointer-events-none" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`${metric.bg} ${metric.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className="w-6 h-6" />
                </div>
                <Badge variant="secondary" className={`${metric.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} border-none font-semibold`}>
                  {metric.trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {metric.trend}
                </Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-navy-950 dark:text-white">{metric.value}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{metric.description}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Content Status */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-muted/30">
            <div>
              <CardTitle className="text-lg font-bold text-navy-950">Content Distribution</CardTitle>
              <CardDescription>Overview of your website sections</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {[
                { label: "MCI Events", count: stats.events, total: 5, color: "bg-blue-600" },
                { label: "News & Blogs", count: stats.news, total: 50, color: "bg-accent" },
                { label: "Partner Logos", count: 12, total: 20, color: "bg-emerald-500" },
                { label: "Team Members", count: 8, total: 15, color: "bg-purple-500" },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{item.label}</span>
                    <span className="text-muted-foreground">{Math.round((item.count / item.total) * 100)}% Capacity</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                      style={{ width: `${Math.min(100, (item.count / item.total) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / System Health */}
        <Card className="border-none shadow-sm rounded-3xl bg-white">
          <CardHeader className="border-b border-muted/30">
            <CardTitle className="text-lg font-bold text-navy-950">Quick Actions</CardTitle>
            <CardDescription>Commonly used tasks</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
             {[
               { icon: ImageIcon, label: "Add Hero Slide", href: "/admin/hero-slides" },
               { icon: Plus, label: "Register New Partner", href: "/admin/partners" },
               { icon: Library, label: "Upload Images", href: "/admin/media-library" },
               { icon: Settings, label: "Audit Logs", href: "/admin/audit-logs" },
             ].map((action, i) => (
               <Link key={i} href={action.href} className="flex items-center justify-between p-4 rounded-2xl border border-muted/50 hover:border-accent hover:bg-accent/5 transition-all group">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                      <action.icon className="w-5 h-5 text-navy-950 group-hover:text-accent" />
                    </div>
                    <span className="text-sm font-semibold">{action.label}</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
               </Link>
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
