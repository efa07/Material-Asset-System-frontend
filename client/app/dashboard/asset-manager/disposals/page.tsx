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
import { useAssets, useDisposals, useCategories, useStores } from '@/hooks/useQueries';
import { useAuthStore } from '@/store/auth.store';
import { Check, X, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DisposalRecord = {
  id: string;
  assetId: string;
  method: "SALE" | "DONATION" | "RECYCLING" | "DESTRUCTION" | "TRANSFER";
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  createdAt: string;
  estimatedValue?: number;
};

import { useCreateDisposal, useApproveDisposal, useRejectDisposal } from '@/hooks/useMutations';

export default function DisposalsPage() {
  const { roles } = useAuthStore();
  const isAdmin = roles.includes('admin') || roles.includes('ADMIN');
  const { data: assets = [] } = useAssets();
  const { data: categories = [] } = useCategories();
  const { data: stores = [] } = useStores();
  const { mutate: createDisposal } = useCreateDisposal();
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

  const [open, setOpen] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [storeFilter, setStoreFilter] = useState<string>("all");

  const [draft, setDraft] = useState({
    assetId: "",
    method: "SALE" as DisposalRecord["method"],
    reason: "",
  });

  const availableAssets = useMemo(() => {
    return assets.filter(a => {
      const isNotDisposed = a.status !== "DISPOSED";
      const matchesCategory = categoryFilter === "all" || a.categoryId === categoryFilter;
      const matchesStore = storeFilter === "all" || a.storeId === storeFilter;
      return isNotDisposed && matchesCategory && matchesStore;
    });
  }, [assets, categoryFilter, storeFilter]);

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
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="mb-2 block">Category Filter</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="mb-2 block">Store Filter</Label>
                   <Select value={storeFilter} onValueChange={setStoreFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Stores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stores</SelectItem>
                      {stores.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                 <Label>Asset</Label>
                 <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboboxOpen}
                      className="w-full justify-between"
                    >
                      {draft.assetId
                        ? assets.find((asset) => asset.id === draft.assetId)?.name
                        : "Select asset..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[450px] p-0">
                    <Command>
                      <CommandInput placeholder="Search asset by name or code..." />
                      <CommandList>
                        <CommandEmpty>No asset found.</CommandEmpty>
                        <CommandGroup>
                          {availableAssets.slice(0, 50).map((asset) => (
                            <CommandItem
                              key={asset.id}
                              value={asset.name + " " + (asset.barcode || "") + " " + (asset.serialNumber || "")}
                              onSelect={() => {
                                setDraft((d) => ({ ...d, assetId: asset.id }));
                                setComboboxOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  draft.assetId === asset.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {asset.name} ({asset.barcode || asset.serialNumber || '—'})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <X className="h-5 w-5 text-red-500" />
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
                <div className="flex items-center gap-2">
                  {isAdmin && r.status === 'PENDING' && (
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
