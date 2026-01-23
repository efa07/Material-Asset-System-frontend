"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Filter, Trash2, CheckCircle, Clock } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAssets, useDisposals } from '@/hooks/useQueries';

type DisposalRecord = {
  id: string;
  assetId: string;
  method: "SALE" | "DONATION" | "RECYCLING" | "DESTRUCTION" | "TRANSFER";
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  createdAt: string;
  estimatedValue?: number;
};

import { useCreateDisposal } from '@/hooks/useMutations';

export default function DisposalsPage() {
  const { data: assets = [] } = useAssets();
  const { mutate: createDisposal } = useCreateDisposal();
  const { data: dbDisposals = [] } = useDisposals();
  
  // Transform DB records to UI format
  const records = useMemo(() => {
      return dbDisposals.map((d: any) => ({
          id: d.id,
          assetId: d.assetId,
          method: d.method as any,
          reason: d.reason || '',
          status: 'COMPLETED', // DB doesn't track status yet, assuming completed
          createdAt: d.disposalDate || d.createdAt,
          estimatedValue: Number(d.value) || 0
      }));
  }, [dbDisposals]);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [draft, setDraft] = useState({
    assetId: "",
    method: "SALE" as DisposalRecord["method"],
    reason: "",
  });

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((r) => {
      const asset = assets.find((a) => a.id === r.assetId);
      const matchesSearch = !q || asset?.name.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter, assets]);

  const pending = records.filter((r) => r.status === "PENDING").length;
  const approved = records.filter((r) => r.status === "APPROVED").length;
  const completed = records.filter((r) => r.status === "COMPLETED").length;

  const getAssetName = (assetId: string) => assets.find((a) => a.id === assetId)?.name ?? "Unknown Asset";

  return (
    <div className="space-y-6">
      <PageHeader title="Asset Disposal" description="Manage disposal requests and approvals">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Request Disposal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Request disposal</DialogTitle>
              <DialogDescription>Submit a disposal request for review.</DialogDescription>
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
                        {a.name} ({a.barcode || a.serialNumber || '—'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Method</Label>
                <Select value={draft.method} onValueChange={(v) => setDraft((d) => ({ ...d, method: v as DisposalRecord["method"] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SALE">Sale</SelectItem>
                    <SelectItem value="DONATION">Donation</SelectItem>
                    <SelectItem value="RECYCLING">Recycling</SelectItem>
                    <SelectItem value="DESTRUCTION">Destruction</SelectItem>
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Reason</Label>
                <Textarea value={draft.reason} onChange={(e) => setDraft((d) => ({ ...d, reason: e.target.value }))} rows={4} placeholder="Explain why this asset should be disposed…" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                    const asset = assets.find((a) => a.id === draft.assetId);
                    createDisposal({
                        assetId: draft.assetId,
                        method: draft.method,
                        reason: draft.reason,
                        disposalDate: new Date().toISOString(),
            value: asset?.purchasePrice ? Math.round(Number(asset.purchasePrice) * 0.1) : undefined,
                    }, {
                        onSuccess: () => {
                            setDraft((d) => ({ ...d, reason: "" }));
                            setOpen(false);
                        }
                    });
                }}
                disabled={!draft.reason.trim()}
              >
                Submit
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
                <p className="text-2xl font-bold">{pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
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
                <p className="text-2xl font-bold">{approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Trash2 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completed}</p>
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
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No disposal records found.</div>
          ) : (
            filtered.slice(0, 20).map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
                <div className="space-y-1">
                  <p className="font-medium">{getAssetName(r.assetId)}</p>
                  <p className="text-sm text-muted-foreground">{r.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.method} • {new Date(r.createdAt).toLocaleDateString()} • value {r.estimatedValue ? `$${r.estimatedValue.toLocaleString()}` : "—"}
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
