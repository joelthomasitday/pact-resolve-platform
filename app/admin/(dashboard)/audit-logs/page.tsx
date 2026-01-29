"use client";

import React, { useEffect, useState } from "react";
import { 
  History, 
  Search, 
  User as UserIcon, 
  Clock, 
  Filter, 
  ArrowUpDown,
  FileCode,
  Download,
  Calendar,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/context/AuthContext";

export default function AuditLogsPage() {
  const { token, isAdmin } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/audit-logs", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setLogs(result.data || []);
      } else {
        toast.error(result.error || "Failed to fetch logs");
      }
    } catch (error) {
      toast.error("An error occurred while fetching audit logs");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "UPDATE": return "bg-blue-100 text-blue-700 border-blue-200";
      case "DELETE": return "bg-red-100 text-red-700 border-red-200";
      case "LOGIN": return "bg-purple-100 text-purple-700 border-purple-200";
      case "FILE_UPLOAD": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-950 flex items-center gap-3">
            <History className="w-8 h-8 text-accent" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground">Track every action taken within the admin dashboard.</p>
        </div>
        <Button variant="outline" className="rounded-xl gap-2" onClick={fetchLogs} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpDown className="w-4 h-4" />}
          Refresh Logs
        </Button>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search by action, resource, or user ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl max-w-lg"
              />
            </div>
            <div className="flex gap-2">
               <Button variant="outline" className="rounded-xl gap-2">
                 <Calendar className="w-4 h-4" />
                 Date Range
               </Button>
               <Button variant="outline" className="rounded-xl gap-2">
                 <Download className="w-4 h-4" />
                 Export CSV
               </Button>
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Admin User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                   Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-6 w-20 bg-muted animate-pulse rounded-full" /></TableCell>
                      <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell className="text-right"><div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      No audit logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log._id} className="hover:bg-muted/30 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-navy-950">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserIcon className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs font-mono truncate max-w-[100px]">{log.userId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getActionBadge(log.action)} font-bold text-[10px] h-5`}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-medium text-muted-foreground uppercase">{log.resource}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setSelectedLog(log)}
                          className="hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <FileCode className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Log Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-xl rounded-3xl p-0 border-none shadow-2xl">
          <DialogHeader className="p-8 bg-navy-950 text-white rounded-t-3xl">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl font-bold">Action Details</DialogTitle>
                <DialogDescription className="text-blue-100">
                  Full metadata for the selected audit log entry.
                </DialogDescription>
              </div>
              <Badge variant="outline" className={`${selectedLog ? getActionBadge(selectedLog.action) : ''} font-bold`}>
                {selectedLog?.action}
              </Badge>
            </div>
          </DialogHeader>
          <div className="p-8 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3" /> Timestamp</p>
                <p className="font-semibold">{selectedLog && new Date(selectedLog.timestamp).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1.5"><UserIcon className="w-3 h-3" /> User ID</p>
                <p className="font-mono text-xs">{selectedLog?.userId}</p>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <p className="text-sm font-semibold">Technical Data Payload</p>
              <div className="bg-navy-950 rounded-2xl p-6 overflow-x-auto">
                <pre className="text-emerald-400 text-xs font-mono">
                  {JSON.stringify(selectedLog?.details || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
          <div className="p-8 border-t bg-muted/10 rounded-b-3xl flex justify-end">
            <Button className="rounded-xl px-8" onClick={() => setSelectedLog(null)}>Close Details</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
