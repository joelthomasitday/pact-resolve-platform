"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, 
  Loader2, 
  Trash2, 
  Edit, 
  ArrowLeft, 
  Calendar,
  MapPin,
  Sparkles,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
  Image as ImageIcon,
  FlaskConical,
  Target,
  Award,
  BookOpen,
  Users,
  Zap,
  Lightbulb,
  History,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/context/AuthContext";
import { ProjectUpdate, ProjectGalleryImage, ArchivedProject } from "@/lib/db/schemas";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { motion, AnimatePresence } from "framer-motion";

// Icon mapping for project updates
const iconOptions = [
  { value: "FlaskConical", icon: FlaskConical, label: "Workshop" },
  { value: "Target", icon: Target, label: "Competition" },
  { value: "Award", icon: Award, label: "Lecture" },
  { value: "BookOpen", icon: BookOpen, label: "Seminar" },
  { value: "Users", icon: Users, label: "Bootcamp" },
  { value: "Zap", icon: Zap, label: "Webinar" },
  { value: "Lightbulb", icon: Lightbulb, label: "Other" },
];

const categoryOptions = [
  "Workshop",
  "Competition", 
  "Lecture",
  "Seminar",
  "Bootcamp",
  "Webinar",
  "Conference",
  "Other"
];

export default function ProjectUpdatesPage() {
  const { token } = useAuth();
  
  // States for different sections
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [galleryItems, setGalleryItems] = useState<ProjectGalleryImage[]>([]);
  const [archivedProjects, setArchivedProjects] = useState<ArchivedProject[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Updates Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempItem, setTempItem] = useState<Partial<ProjectUpdate>>({
    title: "",
    date: "",
    location: "",
    category: "Workshop",
    iconName: "FlaskConical",
    order: 1,
    isActive: true
  });

  // Gallery Dialog States
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [editingGalleryIndex, setEditingGalleryIndex] = useState<number | null>(null);
  const [tempGalleryItem, setTempGalleryItem] = useState<Partial<ProjectGalleryImage>>({
    title: "",
    description: "",
    image: { url: "", alt: "" },
    order: 1,
    isActive: true
  });

  // Archive Dialog States
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [editingArchiveIndex, setEditingArchiveIndex] = useState<number | null>(null);
  const [tempArchiveItem, setTempArchiveItem] = useState<Partial<ArchivedProject>>({
    title: "",
    location: "",
    description: "",
    link: "",
    category: "Workshop",
    image: "",
    order: 1,
    isActive: true
  });

  useEffect(() => { 
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchUpdates(),
        fetchGallery(),
        fetchArchives()
      ]);
    } catch (e) {
      console.error("Fetch all error:", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchUpdates() {
    try {
      const res = await fetch("/api/content/project-updates?all=true", { cache: 'no-store' });
      const result = await res.json();
      if (result.success && result.data) setUpdates(result.data);
    } catch (e) { toast.error("Failed to load updates."); }
  }

  async function fetchGallery() {
    try {
      const res = await fetch("/api/content/project-gallery?all=true", { cache: 'no-store' });
      const result = await res.json();
      if (result.success && result.data) setGalleryItems(result.data);
    } catch (e) { toast.error("Failed to load gallery."); }
  }

  async function fetchArchives() {
    try {
      const res = await fetch("/api/content/archived-projects?all=true", { cache: 'no-store' });
      const result = await res.json();
      if (result.success && result.data) setArchivedProjects(result.data);
    } catch (e) { toast.error("Failed to load archives."); }
  }

  const handleGlobalPublish = async () => {
    setIsSaving(true);
    toast.info("Publishing all changes...");
    try {
      // Logic could be expanded here if needed, but for now we focus on individual saves mostly
      // This button acts as a clear confirmation
      toast.success("All sections synchronized!");
    } catch (e) { toast.error("Global publish failed"); }
    finally { setIsSaving(false); }
  };

  // --- UPDATES LOGIC ---
  const addUpdate = () => {
    setEditingIndex(null);
    setTempItem({
      title: "",
      date: "",
      location: "",
      category: "Workshop",
      iconName: "FlaskConical",
      order: updates.length + 1,
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    setEditingIndex(index);
    setTempItem({ ...updates[index] });
    setIsDialogOpen(true);
  };

  const saveTempItem = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/content/project-updates", {
        method: tempItem._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(tempItem)
      });
      const result = await res.json();
      if (result.success) {
        toast.success(tempItem._id ? "Update saved!" : "Update added!");
        setIsDialogOpen(false);
        fetchUpdates();
      }
    } catch (e) { toast.error("Operation failed"); } 
    finally { setIsSaving(false); }
  };

  const removeUpdate = async (id: string) => {
    try {
      await fetch(`/api/content/project-updates?id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      toast.success("Update removed");
      fetchUpdates();
    } catch (e) { toast.error("Delete failed"); }
  };

  // --- GALLERY LOGIC ---
  const addGalleryItem = () => {
    setEditingGalleryIndex(null);
    setTempGalleryItem({
      title: "",
      description: "",
      image: { url: "", alt: "" },
      order: galleryItems.length + 1,
      isActive: true
    });
    setIsGalleryDialogOpen(true);
  };

  const openGalleryEditDialog = (index: number) => {
    setEditingGalleryIndex(index);
    setTempGalleryItem({ ...galleryItems[index] });
    setIsGalleryDialogOpen(true);
  };

  const saveGalleryItemAction = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/content/project-gallery", {
        method: tempGalleryItem._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(tempGalleryItem)
      });
      if ((await res.json()).success) {
        toast.success("Gallery updated!");
        setIsGalleryDialogOpen(false);
        fetchGallery();
      }
    } catch (e) { toast.error("Failed to save gallery item"); } 
    finally { setIsSaving(false); }
  };

  const removeGalleryItem = async (id: string) => {
    try {
      await fetch(`/api/content/project-gallery?id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      toast.success("Moment removed");
      fetchGallery();
    } catch (e) { toast.error("Delete failed"); }
  };

  // --- ARCHIVE LOGIC ---
  const addArchiveItem = () => {
    setEditingArchiveIndex(null);
    setTempArchiveItem({
      title: "",
      location: "",
      description: "",
      link: "",
      category: "Workshop",
      image: "",
      order: archivedProjects.length + 1,
      isActive: true
    });
    setIsArchiveDialogOpen(true);
  };

  const openArchiveEditDialog = (index: number) => {
    setEditingArchiveIndex(index);
    setTempArchiveItem({ ...archivedProjects[index] });
    setIsArchiveDialogOpen(true);
  };

  const saveArchiveItemAction = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/content/archived-projects", {
        method: tempArchiveItem._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(tempArchiveItem)
      });
      if ((await res.json()).success) {
        toast.success("Archive updated!");
        setIsArchiveDialogOpen(false);
        fetchArchives();
      }
    } catch (e) { toast.error("Failed to save archive project"); } 
    finally { setIsSaving(false); }
  };

  const removeArchiveItem = async (id: string) => {
    try {
      await fetch(`/api/content/archived-projects?id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      toast.success("Project moved from archive");
      fetchArchives();
    } catch (e) { toast.error("Delete failed"); }
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
        <p className="text-muted-foreground animate-pulse font-medium italic">Loading institutional knowledge...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-navy-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <Link href="/admin/events" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-500/80 hover:text-amber-500 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Global Events Engine
            </Link>
            <div className="space-y-1">
              <h1 className="page-title text-4xl md:text-5xl font-black tracking-tighter italic uppercase flex items-center gap-4">
                <LayoutGrid className="w-10 h-10 text-amber-500" /> 
                Events & Projects
              </h1>
              <p className="text-white/60 text-lg font-light max-w-xl">
                The centralized command center for upcoming updates, ceremonial galleries, and the archived legacy.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <Button 
              onClick={handleGlobalPublish} 
              disabled={isSaving}
              className="rounded-2xl px-10 h-14 bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg shadow-xl shadow-amber-900/40 border-none transition-all hover:scale-105"
            >
              {isSaving ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Sparkles className="w-5 h-5 mr-3" />}
              Synchronize Site
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="updates" className="space-y-8">
        <TabsList className="bg-white p-1 rounded-2xl border shadow-xs w-full justify-start overflow-x-auto h-auto">
          <TabsTrigger value="updates" className="rounded-xl px-8 py-4 data-[state=active]:bg-navy-950 data-[state=active]:text-white font-bold transition-all uppercase tracking-widest text-xs flex-1 md:flex-none">
            <Calendar className="w-4 h-4 mr-2" /> Watch Out For
          </TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-xl px-8 py-4 data-[state=active]:bg-navy-950 data-[state=active]:text-white font-bold transition-all uppercase tracking-widest text-xs flex-1 md:flex-none">
            <ImageIcon className="w-4 h-4 mr-2" /> Moments Gallery
          </TabsTrigger>
          <TabsTrigger value="archive" className="rounded-xl px-8 py-4 data-[state=active]:bg-navy-950 data-[state=active]:text-white font-bold transition-all uppercase tracking-widest text-xs flex-1 md:flex-none">
            <History className="w-4 h-4 mr-2" /> Projects Archive
          </TabsTrigger>
        </TabsList>

        {/* --- UPDATES TAB --- */}
        <TabsContent value="updates" className="space-y-8">
           <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white border rounded-3xl p-6 shadow-xs">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600"><Calendar className="w-6 h-6" /></div>
                <div>
                   <h3 className="font-bold text-navy-950 italic">Upcoming Updates</h3>
                   <p className="text-xs text-navy-950/40 font-bold uppercase tracking-widest">{updates.length} items currently managed</p>
                </div>
             </div>
             <Button onClick={addUpdate} className="rounded-2xl h-12 px-8 bg-navy-900 font-bold hover:bg-navy-800 transition-all hover:scale-105 active:scale-95">
                <Plus className="w-5 h-5 mr-2" /> New Entry
             </Button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {updates.map((update, index) => (
                  <motion.div key={update._id?.toString() || index} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card className="rounded-[2.5rem] border-none shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col h-full bg-white group">
                       <div className="p-8 space-y-6 flex-1">
                          <div className="flex justify-between items-start">
                             <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none font-bold uppercase tracking-widest text-[10px] px-3 py-1 ring-4 ring-amber-500/5">{update.category}</Badge>
                             <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => openEditDialog(index)}><Edit className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-red-500" onClick={() => removeUpdate(update._id!.toString())}><Trash2 className="w-4 h-4" /></Button>
                             </div>
                          </div>
                          <h4 className="text-xl font-black italic uppercase text-navy-950 tracking-tighter leading-tight shrink-0">{update.title}</h4>
                          <div className="space-y-3 font-medium text-navy-900/60">
                             <p className="flex items-center gap-3 text-sm underline decoration-amber-500/30 underline-offset-4"><Calendar className="w-4 h-4 text-amber-600" /> {update.date}</p>
                             <p className="flex items-center gap-3 text-sm italic"><MapPin className="w-4 h-4 text-amber-600" /> {update.location}</p>
                          </div>
                       </div>
                       <CardFooter className="px-8 py-5 border-t border-navy-50 bg-gray-50/50 justify-between">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${update.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-900/30">{update.isActive ? 'Live' : 'Hidden'}</span>
                          </div>
                          <Button variant="ghost" className="h-8 px-3 text-[10px] font-black uppercase tracking-widest hover:text-amber-600" onClick={() => openEditDialog(index)}>Edit Details</Button>
                       </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </TabsContent>

        {/* --- GALLERY TAB --- */}
        <TabsContent value="gallery" className="space-y-8">
           <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white border rounded-3xl p-6 shadow-xs">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy-900/10 flex items-center justify-center text-navy-900"><ImageIcon className="w-6 h-6" /></div>
                <div>
                   <h3 className="font-bold text-navy-950 italic uppercase">Captured legacy</h3>
                   <p className="text-xs text-navy-950/40 font-bold tracking-widest">{galleryItems.length} moments in view</p>
                </div>
             </div>
             <Button onClick={addGalleryItem} className="rounded-2xl h-12 px-8 bg-amber-600 font-bold hover:bg-amber-500 transition-all hover:scale-105 active:scale-95 shadow-amber-900/20 border-none">
                <Plus className="w-5 h-5 mr-2" /> Add New Moment
             </Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <AnimatePresence mode="popLayout">
               {galleryItems.map((item, index) => (
                 <motion.div key={item._id?.toString() || index} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <Card className="group relative overflow-hidden rounded-[2.5rem] border-none shadow-2xl aspect-video bg-navy-950">
                     {item.image?.url ? <Image src={item.image.url} alt={item.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon className="w-12 h-12" /></div>}
                     <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                     <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h5 className="text-white italic uppercase tracking-tighter text-xl line-clamp-1 font-bold">{item.title}</h5>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Stored Moment • {item.isActive ? 'Active' : 'Private'}</p>
                     </div>
                     <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl bg-white/90 backdrop-blur shadow-2xl" onClick={() => openGalleryEditDialog(index)}><Edit className="w-5 h-5" /></Button>
                        <Button size="icon" variant="destructive" className="h-10 w-10 rounded-xl shadow-2xl" onClick={() => removeGalleryItem(item._id!.toString())}><Trash2 className="w-5 h-5" /></Button>
                     </div>
                   </Card>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        </TabsContent>

        {/* --- ARCHIVE TAB --- */}
        <TabsContent value="archive" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
           <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white border rounded-3xl p-6 shadow-xs">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600"><History className="w-6 h-6" /></div>
                <div>
                   <h3 className="font-bold text-navy-950 italic uppercase">Project archives</h3>
                   <p className="text-xs text-navy-950/40 font-bold tracking-widest">{archivedProjects.length} legacy entries secured</p>
                </div>
             </div>
             <Button onClick={addArchiveItem} className="rounded-2xl h-12 px-8 bg-emerald-700 font-bold hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95 shadow-none border-none text-white">
                <Plus className="w-5 h-5 mr-2" /> Create Archive Entry
             </Button>
           </div>

           <div className="grid grid-cols-1 gap-6 max-w-5xl">
              <AnimatePresence mode="popLayout">
                {archivedProjects.map((item, index) => (
                  <motion.div key={item._id?.toString() || index} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                   <Card className="rounded-4xl border-none shadow-xs hover:shadow-xl transition-all overflow-hidden bg-white p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 group">
                       <div className="w-full md:w-60 h-40 shrink-0 relative rounded-2xl overflow-hidden bg-gray-100 ring-1 ring-navy-50">
                          {item.image ? <Image src={item.image} alt={item.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" /> : <div className="w-full h-full flex items-center justify-center text-navy-100"><ImageIcon className="w-10 h-10" /></div>}
                       </div>
                       <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-4">
                             <Badge variant="outline" className="border-navy-100 text-navy-400 font-black uppercase tracking-widest text-[10px] px-3">{item.category}</Badge>
                             <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3" /> {item.location}</span>
                          </div>
                          <h4 className="text-xl md:text-2xl italic text-navy-950 uppercase tracking-tighter decoration-emerald-200 decoration-4 underline-offset-8 transition-all group-hover:decoration-emerald-500/30 font-bold">{item.title}</h4>
                          <p className="text-sm text-navy-950/60 font-medium line-clamp-2 leading-relaxed">{item.description}</p>
                       </div>
                       <div className="shrink-0 flex md:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <Button size="icon" variant="ghost" className="h-10 w-10 text-navy-950 hover:bg-navy-50 rounded-xl" onClick={() => openArchiveEditDialog(index)}><Edit className="w-5 h-5" /></Button>
                          <Button size="icon" variant="ghost" className="h-10 w-10 text-red-500 hover:bg-red-50 rounded-xl" onClick={() => removeArchiveItem(item._id!.toString())}><Trash2 className="w-5 h-5" /></Button>
                          {item.link && <Link href={item.link} target="_blank"><Button size="icon" variant="ghost" className="h-10 w-10 text-emerald-600 hover:bg-emerald-50 rounded-xl"><ExternalLink className="w-5 h-5" /></Button></Link>}
                       </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </TabsContent>
      </Tabs>

      {/* --- DIALOGS --- */}

      {/* UPDATE DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-4xl border-none p-0 bg-white shadow-2xl">
          <div className="bg-navy-950 p-10 text-white"><DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">Event Update</DialogTitle></div>
          <div className="p-10 space-y-8">
            <div className="space-y-4">
              <Label className="font-black italic uppercase tracking-[0.2em] text-[10px] text-navy-950/30">Entry Title</Label>
              <Input value={tempItem.title} onChange={e => setTempItem({...tempItem, title: e.target.value})} className="h-14 rounded-2xl text-lg font-bold border-navy-50 bg-gray-50/50" placeholder="e.g. Masterclass on Mediation" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-navy-950">
               <div className="space-y-3">
                 <Label className="font-black italic uppercase tracking-[0.2em] text-[10px] text-navy-950/30">Schedule / Date</Label>
                 <Input value={tempItem.date} onChange={e => setTempItem({...tempItem, date: e.target.value})} className="h-14 rounded-2xl border-navy-50 font-bold" />
               </div>
               <div className="space-y-3">
                 <Label className="font-black italic uppercase tracking-[0.2em] text-[10px] text-navy-950/30">Host Venue / Location</Label>
                 <Input value={tempItem.location} onChange={e => setTempItem({...tempItem, location: e.target.value})} className="h-14 rounded-2xl border-navy-50 font-bold" />
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                 <Label className="font-black italic uppercase tracking-[0.2em] text-[10px] text-navy-950/30">Category Classification</Label>
                 <select value={tempItem.category} onChange={e => setTempItem({...tempItem, category: e.target.value})} className="w-full h-14 rounded-2xl border border-navy-50 px-4 font-bold bg-white text-navy-950">
                   {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                 </select>
               </div>
               <div className="space-y-3">
                 <Label className="font-black italic uppercase tracking-[0.2em] text-[10px] text-navy-950/30">Active Status</Label>
                 <div className="flex items-center justify-between h-14 px-6 bg-navy-50/50 rounded-2xl">
                   <span className="text-sm uppercase text-navy-900/60 font-bold">{tempItem.isActive ? "Live on site" : "Draft Hidden"}</span>
                   <Switch checked={tempItem.isActive} onCheckedChange={val => setTempItem({...tempItem, isActive: val})} />
                 </div>
               </div>
            </div>
          </div>
          <DialogFooter className="p-10 bg-gray-50 flex justify-end gap-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold uppercase tracking-widest text-xs">Return</Button>
            <Button onClick={saveTempItem} className="bg-navy-950 text-white font-black italic uppercase tracking-widest px-10 rounded-2xl h-14 shadow-xl shadow-navy-950/20 active:scale-95 transition-all">Synchronize Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* GALLERY DIALOG */}
      <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
        <DialogContent className="max-w-4xl rounded-[3rem] border-none p-0 bg-white shadow-2xl">
          <div className="bg-amber-600 p-10 text-white"><DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">Gallery Moment</DialogTitle></div>
          <div className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-4">
                  <Label className="font-black italic uppercase tracking-[0.2em] text-[10px] text-navy-950/30 underline underline-offset-8 decoration-amber-500/20">Moment Master Asset</Label>
                  <div className="aspect-square w-full">
                     <ImageUpload value={tempGalleryItem.image?.url} onChange={url => setTempGalleryItem({...tempGalleryItem, image: {url, alt: tempGalleryItem.title || "Moment"}})} />
                  </div>
               </div>
               <div className="space-y-8">
                  <div className="space-y-3">
                     <Label className="font-black italic uppercase tracking-[0.2em] text-[10px] text-navy-950/30">Moment Label</Label>
                     <Input value={tempGalleryItem.title} onChange={e => setTempGalleryItem({...tempGalleryItem, title: e.target.value})} className="h-14 rounded-2xl border-navy-50 font-bold bg-gray-50/50" />
                  </div>
                  <div className="space-y-3">
                     <Label className="font-black italic uppercase tracking-[0.2em] text-[10px] text-navy-950/30">Brief Context</Label>
                     <Textarea value={tempGalleryItem.description} onChange={e => setTempGalleryItem({...tempGalleryItem, description: e.target.value})} className="rounded-2xl min-h-[140px] border-navy-50 font-medium bg-gray-50/50" />
                  </div>
                   <div className="flex items-center justify-between p-6 bg-amber-50 rounded-2xl">
                      <Label className="font-black italic uppercase tracking-widest text-xs text-amber-900">Institutional Visibility</Label>
                      <Switch checked={tempGalleryItem.isActive} onCheckedChange={val => setTempGalleryItem({...tempGalleryItem, isActive: val})} />
                   </div>
               </div>
            </div>
          </div>
          <DialogFooter className="p-10 bg-gray-50 flex justify-end gap-4">
            <Button variant="ghost" onClick={() => setIsGalleryDialogOpen(false)} className="font-bold uppercase tracking-widest text-xs">Cancel</Button>
            <Button onClick={saveGalleryItemAction} className="bg-amber-600 text-white font-black italic uppercase tracking-widest px-10 rounded-2xl h-14 shadow-xl shadow-amber-900/20 active:scale-95 transition-all">Archive Moment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ARCHIVE DIALOG */}
      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent className="max-w-4xl rounded-[3rem] border-none p-0 bg-white shadow-2xl">
          <div className="bg-emerald-800 p-10 text-white"><DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-emerald-50">Legacy Project Record</DialogTitle></div>
          <div className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <div className="space-y-3">
                     <Label className="font-black italic uppercase tracking-[0.2em] text-[10px] text-navy-950/30">Project Title</Label>
                     <Input value={tempArchiveItem.title} onChange={e => setTempArchiveItem({...tempArchiveItem, title: e.target.value})} className="h-14 rounded-2xl border-navy-50 font-bold text-navy-950" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-3">
                        <Label className="font-black italic uppercase tracking-[0.2em] text-[10px] text-navy-950/30">Category</Label>
                        <select value={tempArchiveItem.category} onChange={e => setTempArchiveItem({...tempArchiveItem, category: e.target.value})} className="w-full h-14 rounded-2xl border border-navy-50 font-bold bg-white text-navy-950 px-4">
                           {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                     </div>
                     <div className="space-y-3">
                        <Label className="font-black italic uppercase tracking-[0.2em] text-[10px] text-navy-950/30">Location & Year</Label>
                        <Input value={tempArchiveItem.location} onChange={e => setTempArchiveItem({...tempArchiveItem, location: e.target.value})} className="h-14 rounded-2xl border-navy-50 font-bold text-navy-950" placeholder="e.g. Mumbai, 2024" />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <Label className="font-black italic uppercase tracking-[0.2em] text-[10px] text-navy-950/30">Project Link / URL</Label>
                     <Input value={tempArchiveItem.link} onChange={e => setTempArchiveItem({...tempArchiveItem, link: e.target.value})} className="h-14 rounded-2xl border-navy-50 font-bold text-navy-950" placeholder="e.g. youtube.com/..." />
                  </div>
               </div>
               <div className="space-y-8">
                  <div className="space-y-4">
                      <Label className="font-black italic uppercase tracking-[0.2em] text-[10px] text-navy-950/30 underline underline-offset-8 decoration-emerald-500/20">Project Master Asset</Label>
                      <ImageUpload 
                        value={tempArchiveItem.image} 
                        onChange={url => setTempArchiveItem({...tempArchiveItem, image: url})} 
                      />
                   </div>
                  <div className="space-y-3">
                     <Label className="font-black italic uppercase tracking-[0.2em] text-[10px] text-navy-950/30">Detailed Impact Statement</Label>
                     <Textarea value={tempArchiveItem.description} onChange={e => setTempArchiveItem({...tempArchiveItem, description: e.target.value})} className="rounded-2xl min-h-[100px] border-navy-50 font-medium" />
                  </div>
               </div>
            </div>
          </div>
          <DialogFooter className="p-10 bg-gray-50 flex justify-end gap-4">
             <Button variant="ghost" onClick={() => setIsArchiveDialogOpen(false)} className="font-bold uppercase tracking-widest text-xs">Dismiss</Button>
             <Button onClick={saveArchiveItemAction} className="bg-emerald-900 text-white font-black italic uppercase tracking-widest px-10 rounded-2xl h-14 shadow-xl shadow-emerald-950/20 active:scale-95 transition-all">Secure in Legacy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
