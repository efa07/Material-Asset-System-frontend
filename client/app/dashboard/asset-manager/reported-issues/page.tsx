"use client";

import { useMemo, useState } from "react";
import { Search, AlertTriangle, CheckCircle, Clock } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssets, useMaintenanceTasks } from '@/hooks/useQueries';
import { useUpdateMaintenanceTask } from '@/hooks/useMutations';
import { MaintenanceTask, MaintenanceStatus } from "@/types";

export default function ReportedIssuesPage() {
  const { data: records = [], isLoading } = useMaintenanceTasks();
  const { data: assets = [] } = useAssets();
  const { mutate: updateTask } = useUpdateMaintenanceTask();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<MaintenanceStatus | "">("");
  const [updateNotes, setUpdateNotes] = useState("");
  
  // Filter for reported issues only
  const reportedIssues = useMemo(() => {
    return records.filter(r => r.type === "ISSUE_REPORT");
  }, [records]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return reportedIssues.filter((r) => {
      const asset = assets.find((a) => a.id === r.assetId);
      const matchesSearch =
        !q ||
        asset?.name.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        (asset?.serialNumber || '').toLowerCase().includes(q);
      return matchesSearch;
    });
  }, [reportedIssues, searchQuery, assets]);

  const handleUpdateStatus = () => {
    if (!selectedTask || !updateStatus) return;
    updateTask({
        id: selectedTask.id,
        status: updateStatus,
        description: selectedTask.description + (updateNotes ? `\n\nUpdate: ${updateNotes}` : "")
    }, {
        onSuccess: () => {
            setIsDetailsOpen(false);
            setSelectedTask(null);
            setUpdateStatus("");
            setUpdateNotes("");
        }
    });
  };

  const getAssetName = (assetId: string) => assets.find((a) => a.id === assetId)?.name ?? "Unknown Asset";
  const getAssetSerial = (assetId: string) => assets.find((a) => a.id === assetId)?.serialNumber ?? "";

  return (
    <div className="space-y-6">
      <PageHeader title="Reported Issues" description="Review and manage issues reported by employees" />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Issues ({filtered.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
                <div className="text-center py-4">Loading issues...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="mx-auto h-12 w-12 opacity-20 mb-2" />
                <p>No reported issues found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filtered.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                             <h4 className="font-semibold">{getAssetName(task.assetId)}</h4>
                             <span className="text-xs text-muted-foreground">{getAssetSerial(task.assetId)}</span>
                        </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {task.description || "No description provided"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={task.status} />
                        <span className="text-xs text-muted-foreground">
                          Reported: {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                        setSelectedTask(task);
                        setUpdateStatus(task.status);
                        setIsDetailsOpen(true);
                    }}>
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Issue Details</DialogTitle>
                <DialogDescription>
                    Review issue for {selectedTask ? getAssetName(selectedTask.assetId) : ''}
                </DialogDescription>
            </DialogHeader>
            {selectedTask && (
                <div className="grid gap-4 py-4">
                    <div className="space-y-1">
                        <Label className="text-muted-foreground text-xs">Description</Label>
                        <div className="p-3 bg-muted rounded-md text-sm">
                            {selectedTask.description || "No description"}
                        </div>
                    </div>
                    
                    <div className="grid gap-2">
                        <Label>Update Status</Label>
                        <Select value={updateStatus} onValueChange={(v) => setUpdateStatus(v as MaintenanceStatus)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Add Notes</Label>
                        <Textarea 
                            placeholder="Add technicians notes or resolution details..."
                            value={updateNotes}
                            onChange={(e) => setUpdateNotes(e.target.value)}
                        />
                    </div>
                </div>
            )}
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateStatus}>Update Issue</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
