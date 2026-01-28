"use client";

import { useMemo, useState } from "react";
import { Search, Filter, Trash2, CheckCircle, Clock } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssets, useDisposals } from '@/hooks/useQueries';
import { useAuthStore } from '@/store/auth.store';
import { Check, X } from "lucide-react";

import { useApproveDisposal, useRejectDisposal } from '@/hooks/useMutations';

export default function StoreDisposalsPage() {
  const { roles } = useAuthStore();
  const isStoreManager = roles.includes('STORE_MANAGER');
  const { data: assets = [] } = useAssets();
  
  // Note: In real app we might want to filter assets owned by this store manager's store
  // but for now we'll assume they can see/approve all pending ones or the backend filters them.
  
  const { mutate: approveDisposal } = useApproveDisposal();
  const { mutate: rejectDisposal } = useRejectDisposal();
  const { data: dbDisposals = [] } = useDisposals();
  
  // Transform DB records to UI format
  const records = useMemo(() => {
      return dbDisposals.map((d: any) => ({
          id: d.id,
          assetId: d.assetId,
          method: d.method as any,
          reason: d.reason || '',
          status: d.status,
          createdAt: d.disposalDate || d.createdAt,
          estimatedValue: Number(d.value) || 0
      }));
  }, [dbDisposals]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING"); // Default to PENDING for approvals

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
  const rejected = records.filter((r) => r.status === "REJECTED").length;

  const getAssetName = (assetId: string) => assets.find((a) => a.id === assetId)?.name ?? "Unknown Asset";

  if (!isStoreManager && !roles.includes('admin')) {
      return <div>Access Denied</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Disposal Approvals" description="Review and approve asset disposal requests" />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md hover:border-amber-500/50">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/0 group-hover:bg-amber-500 transition-all duration-300" />
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pending}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md hover:border-emerald-500/50">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/0 group-hover:bg-emerald-500 transition-all duration-300" />
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md hover:border-red-500/50">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500/0 group-hover:bg-red-500 transition-all duration-300" />
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold">Disposal Requests</CardTitle>
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
                  <p className="text-sm text-muted-foreground">{r.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.method} • {new Date(r.createdAt).toLocaleDateString()} • value {r.estimatedValue ? `$${r.estimatedValue.toLocaleString()}` : "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {r.status === 'PENDING' && (
                    <>
                      <Button size="icon" variant="ghost" onClick={() => approveDisposal(r.id)} title="Approve">
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => rejectDisposal(r.id)} title="Reject">
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
