"use client";

import React, { useEffect, useState } from "react";
import { Plus, Users, Loader2, Edit, Trash2 } from "lucide-react";
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
import { PanelMember } from "@/lib/db/schemas";

export default function PanelMembersAdminPage() {
  const { token } = useAuth();
  const [data, setData] = useState<PanelMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<PanelMember> | null>(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/content/panel-members");
      const result = await res.json();
      if (result.success) setData(result.data || []);
    } catch (e) { toast.error("Fetch failed"); }
    finally { setIsLoading(false); }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/content/panel-members", {
        method: editingItem?._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(editingItem)
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Saved");
        setIsDialogOpen(false);
        fetchItems();
      }
    } catch (e) { toast.error("Save failed"); }
  };

  const openDialog = (item: Partial<PanelMember> = {}) => {
    setEditingItem({ name: "", role: "", order: data.length + 1, isActive: true, image: { url: "", alt: "" }, ...item });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><Users className="w-8 h-8 text-accent" /> Panel Members</h1>
          <p className="text-muted-foreground">Manage lead mediators and neutral panel members.</p>
        </div>
        <Button onClick={() => openDialog()} className="rounded-xl px-6 bg-primary"><Plus className="w-4 h-4 mr-2" /> Add Member</Button>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : data.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No members found.</TableCell></TableRow>
              ) : data.map((item) => (
                <TableRow key={item._id?.toString()} className="group">
                  <TableCell><img src={item.image.url} className="w-10 h-10 object-cover rounded-full bg-muted" /></TableCell>
                  <TableCell className="font-bold">{item.name}</TableCell>
                  <TableCell className="text-sm">{item.role}</TableCell>
                  <TableCell>{item.isActive ? <Badge className="bg-emerald-500">Active</Badge> : <Badge variant="secondary">Hidden</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(item)}><Edit className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden">
          <form onSubmit={handleSave}>
            <DialogHeader className="p-6 bg-navy-950 text-white rounded-t-3xl">
              <DialogTitle>{editingItem?._id ? "Edit Member" : "Add Member"}</DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <div className="space-y-2"><Label>Full Name</Label><Input value={editingItem?.name} onChange={e => setEditingItem({...editingItem!, name: e.target.value})} required className="rounded-xl h-11" /></div>
              <div className="space-y-2"><Label>Professional Role</Label><Input value={editingItem?.role} onChange={e => setEditingItem({...editingItem!, role: e.target.value})} required className="rounded-xl h-11" /></div>
              <div className="space-y-2"><Label>Bio (Optional)</Label><Input value={editingItem?.bio} onChange={e => setEditingItem({...editingItem!, bio: e.target.value})} className="rounded-xl h-11" /></div>
              <ImageUpload label="Profile Photo" value={editingItem?.image?.url} onChange={url => setEditingItem({...editingItem!, image: {url, alt: editingItem?.name || "Member Photo"}})} />
            </div>
            <DialogFooter className="p-6 border-t bg-muted/10">
              <Button type="submit" className="rounded-xl h-11 px-8">Save Member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
