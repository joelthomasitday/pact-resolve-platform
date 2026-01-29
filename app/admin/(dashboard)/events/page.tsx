"use client";

import React, { useEffect, useState } from "react";
import { Plus, Calendar, Loader2, Edit, Trash2, Trophy, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useAuth } from "@/lib/context/AuthContext";
import { MCIEvent } from "@/lib/db/schemas";

export default function EventsAdminPage() {
  const { token } = useAuth();
  const [data, setData] = useState<MCIEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MCIEvent> | null>(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setIsLoading(true);
    try {
      // The API only returns one active event by default, 
      // but we'll show it as a list for potential future support.
      const res = await fetch("/api/content/mci-event");
      const result = await res.json();
      if (result.success) setData(result.data ? (Array.isArray(result.data) ? result.data : [result.data]) : []);
    } catch (e) { toast.error("Fetch failed"); }
    finally { setIsLoading(false); }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/content/mci-event", {
        method: editingItem?._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(editingItem)
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Saved successfully");
        setIsDialogOpen(false);
        fetchItems();
      }
    } catch (e) { toast.error("Save failed"); }
  };

  const openDialog = (item: Partial<MCIEvent> = {}) => {
    setEditingItem({ 
      year: new Date().getFullYear(),
      subtitle: "",
      title: ["MCI"],
      isActive: true,
      heroImage: { url: "", alt: "" },
      visionImage: { url: "", alt: "" },
      competitionImage: { url: "", alt: "" },
      ...item 
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><Trophy className="w-8 h-8 text-accent" /> MCI Events</h1>
          <p className="text-muted-foreground">Manage Mediation Championship India (MCI) editions.</p>
        </div>
        <Button onClick={() => openDialog()} className="rounded-xl px-6 bg-primary"><Plus className="w-4 h-4 mr-2" /> Create New Event</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
        ) : data.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No events found.</p>
          </div>
        ) : data.map((item) => (
          <Card key={item._id?.toString()} className="border-none shadow-md rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="relative h-48">
              <img src={item.heroImage?.url} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-navy-950/80 to-transparent flex flex-col justify-end p-6">
                 <Badge className="w-fit mb-2 bg-accent text-navy-950 font-bold">{item.year}</Badge>
                 <h2 className="text-white text-xl font-bold">{item.title.join(" ")}</h2>
                 <p className="text-blue-100 text-xs truncate">{item.subtitle}</p>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                 {item.isActive && <Badge className="bg-emerald-500 border-none">Active</Badge>}
                 <Button size="icon" variant="secondary" className="rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => openDialog(item)}>
                   <Edit className="w-3 h-3" />
                 </Button>
              </div>
            </div>
            <CardContent className="p-6">
               <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.eventDetails?.dates || "No dates"}</span>
               </div>
               <Button variant="outline" className="w-full rounded-xl hover:bg-primary hover:text-white transition-colors" onClick={() => openDialog(item)}>Manage Event Data</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-0">
          <form onSubmit={handleSave}>
            <DialogHeader className="p-8 bg-navy-950 text-white rounded-t-3xl">
              <DialogTitle>Event Configuration - {editingItem?.year}</DialogTitle>
            </DialogHeader>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2"><Label>Event Year</Label><Input type="number" value={editingItem?.year} onChange={e => setEditingItem({...editingItem!, year: parseInt(e.target.value)})} required className="rounded-xl h-11" /></div>
                <div className="space-y-2"><Label>Event Subtitle</Label><Input value={editingItem?.subtitle} onChange={e => setEditingItem({...editingItem!, subtitle: e.target.value})} className="rounded-xl h-11" /></div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold border-b pb-2">Visual Assets</h3>
                <div className="grid grid-cols-2 gap-6">
                  <ImageUpload label="Hero Background" value={editingItem?.heroImage?.url} onChange={url => setEditingItem({...editingItem!, heroImage: {url, alt: "Hero"}})} />
                  <ImageUpload label="Vision Section Image" value={editingItem?.visionImage?.url} onChange={url => setEditingItem({...editingItem!, visionImage: {url, alt: "Vision"}})} />
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl">
                <div>
                  <p className="font-bold">Active Edition</p>
                  <p className="text-xs text-muted-foreground">Only one event can be active at a time.</p>
                </div>
                <Badge className={editingItem?.isActive ? "bg-emerald-500" : "bg-muted text-muted-foreground"}>
                  {editingItem?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <DialogFooter className="p-8 border-t bg-muted/10 rounded-b-3xl">
              <Button type="submit" className="rounded-xl h-12 px-10 font-bold text-lg shadow-xl shadow-primary/20">Save Event Configuration</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
