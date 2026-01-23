"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Filter, Wrench, CheckCircle, Clock } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAssets, useMaintenanceTasks } from '@/hooks/useQueries';
import { useCreateMaintenanceTask } from '@/hooks/useMutations';

export default function MaintenancePage() {
  const { data: records = [] } = useMaintenanceTasks();
  const { data: assets = [] } = useAssets();
  const { mutate: createMaintenanceTask } = useCreateMaintenanceTask();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const [draft, setDraft] = useState({
    assetId: "",
    type: "PREVENTIVE" as "PREVENTIVE" | "CORRECTIVE" | "INSPECTION",
    maintenanceDate: new Date().toISOString().slice(0, 10),
    description: "",
  });

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((r) => {
      const asset = assets.find((a) => a.id === r.assetId);
      const matchesSearch =
        !q ||
        asset?.name.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter, assets]);

  const scheduledCount = records.filter((r) => r.status === "SCHEDULED").length;
  const inProgressCount = records.filter((r) => r.status === "IN_PROGRESS").length;
  const completedCount = records.filter((r) => r.status === "COMPLETED").length;

  const getAssetName = (assetId: string) => assets.find((a) => a.id === assetId)?.name ?? "Unknown Asset";

  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance Management" description="Schedule and track asset maintenance">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Schedule maintenance</DialogTitle>
              <DialogDescription>Create a new maintenance task for an asset.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Asset</Label>
                <Select value={draft.assetId} onValueChange={(v) => setDraft((d) => ({ ...d, assetId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} ({a.serialNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select value={draft.type} onValueChange={(v) => setDraft((d) => ({ ...d, type: v as typeof d.type }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                      <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                      <SelectItem value="INSPECTION">Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Maintenance date</Label>
                  <Input type="date" value={draft.maintenanceDate} onChange={(e) => setDraft((d) => ({ ...d, maintenanceDate: e.target.value }))} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} rows={4} placeholder="Work requested…" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  createMaintenanceTask(
                    {
                      assetId: draft.assetId,
                      type: draft.type,
                      status: "SCHEDULED",
                      description: draft.description,
                      maintenanceDate: new Date(draft.maintenanceDate).toISOString(),
                    },
                    {
                      onSuccess: () => {
                        setDraft((d) => ({ ...d, description: "" }));
                        setOpen(false);
                      },
                    }
                  );
                }}
                disabled={!draft.description.trim() || !draft.assetId}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{scheduledCount}</p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Wrench className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressCount}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold">Records</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9 w-full sm:w-64" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No records found.</div>
          ) : (
            filtered.slice(0, 20).map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
                <div className="space-y-1">
                  <p className="font-medium">{getAssetName(r.assetId)}</p>
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.type} • {r.maintenanceDate ? new Date(r.maintenanceDate).toLocaleDateString() : '—'}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
