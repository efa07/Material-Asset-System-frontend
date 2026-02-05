"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Search, 
  AlertTriangle, 
  Package, 
  Calendar, 
  Barcode, 
  Box,
  Activity,
  Layers
} from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Asset } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { useUser } from "@/hooks/useQueries";
import { useCreateMaintenance, useCreateReturn } from "@/hooks/useMutations";
import { cn } from "@/lib/utils";

export default function EmployeeMyAssetsPage() {
  const { user: currentUser } = useAppStore();
  const { data: user, isLoading, error } = useUser(currentUser?.email);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [returnNotes, setReturnNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name-asc");

  const createMaintenance = useCreateMaintenance();
  const createReturn = useCreateReturn();

  const myAssets = user?.currentAssets || [];

  const statusOptions = Array.from(
    new Set(myAssets.map((asset) => asset.status).filter(Boolean))
  ) as string[];

  const filteredAssets = myAssets.filter((asset) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      asset.name.toLowerCase().includes(searchLower) ||
      (asset.serialNumber || "").toLowerCase().includes(searchLower) ||
      (asset.category?.name || "").toLowerCase().includes(searchLower)
    );
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    if (sortBy === "category-asc")
      return (a.category?.name || "").localeCompare(b.category?.name || "");
    if (sortBy === "category-desc")
      return (b.category?.name || "").localeCompare(a.category?.name || "");
    if (sortBy === "assigned-desc")
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    if (sortBy === "assigned-asc")
      return (a.createdAt || "").localeCompare(b.createdAt || "");
    return 0;
  });

  const assetsWithActiveIssues = myAssets.filter((asset) =>
    asset.maintenanceLogs?.some(
      (log) =>
        (log.status === "SCHEDULED" || log.status === "IN_PROGRESS") &&
        log.type === "ISSUE_REPORT"
    )
  ).length;

  const handleReportIssue = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsReportDialogOpen(true);
  };

  const handleReturnAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsReturnDialogOpen(true);
  };

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDetailsDialogOpen(true);
  };

  const submitIssueReport = () => {
    if (!selectedAsset) return;

    createMaintenance.mutate({
      assetId: selectedAsset.id,
      type: "ISSUE_REPORT",
      description: issueDescription,
      status: "SCHEDULED",
      reportedByUserId: currentUser?.id
    }, {
      onSuccess: () => {
        setIsReportDialogOpen(false);
        setIssueDescription("");
        setSelectedAsset(null);
      }
    });
  };

  const submitReturnRequest = () => {
    if (!selectedAsset) return;

    createReturn.mutate({
      assetId: selectedAsset.id,
      userId: currentUser?.id,
      notes: returnNotes,
      returnDate: new Date().toISOString(),
    }, {
      onSuccess: () => {
        setIsReturnDialogOpen(false);
        setReturnNotes("");
        setSelectedAsset(null);
      }
    });
  };

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4 text-destructive">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Error loading assets</h3>
          <p className="text-muted-foreground">Unable to fetch your assigned assets.</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1 sm:p-4">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <PageHeader
          title="My Assets"
          description="Manage and track the equipment assigned to you."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-border/40 bg-card/60 backdrop-blur transition-all duration-300 hover:shadow-[0_0_20px_-12px_var(--primary)] hover:border-primary/30 group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Package className="h-20 w-20 transform -rotate-12 translate-x-4 -translate-y-4 text-primary" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total assets</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between relative z-10">
            <div className="text-3xl font-bold tracking-tight text-foreground">{myAssets.length}</div>
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary ring-1 ring-inset ring-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Package className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/40 bg-card/60 backdrop-blur transition-all duration-300 hover:shadow-[0_0_20px_-12px_rgba(234,179,8,0.5)] hover:border-yellow-500/30 group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle className="h-20 w-20 transform -rotate-12 translate-x-4 -translate-y-4 text-yellow-500" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Active issues</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between relative z-10">
            <div className="text-3xl font-bold tracking-tight text-foreground">{assetsWithActiveIssues}</div>
            <div className="rounded-xl bg-yellow-500/10 p-2.5 text-yellow-600 ring-1 ring-inset ring-yellow-500/20 group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/40 bg-card/60 backdrop-blur transition-all duration-300 hover:shadow-[0_0_20px_-12px_var(--primary)] hover:border-primary/30 group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Layers className="h-20 w-20 transform -rotate-12 translate-x-4 -translate-y-4 text-primary" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between relative z-10">
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {new Set(myAssets.map((asset) => asset.category?.name).filter(Boolean)).size}
            </div>
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary ring-1 ring-inset ring-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/40 bg-card/60 backdrop-blur transition-all duration-300 hover:shadow-[0_0_20px_-12px_var(--primary)] hover:border-primary/30 group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="h-20 w-20 transform -rotate-12 translate-x-4 -translate-y-4 text-primary" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Status types</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between relative z-10">
            <div className="text-3xl font-bold tracking-tight text-foreground">{statusOptions.length}</div>
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary ring-1 ring-inset ring-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, serial, category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {(searchQuery || statusFilter !== "all") && (
              <Button
                variant="ghost"
                className="hidden sm:inline-flex"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[170px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[190px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A → Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z → A)</SelectItem>
                <SelectItem value="category-asc">Category (A → Z)</SelectItem>
                <SelectItem value="category-desc">Category (Z → A)</SelectItem>
                <SelectItem value="assigned-desc">Assigned (newest)</SelectItem>
                <SelectItem value="assigned-asc">Assigned (oldest)</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground sm:pl-2">
              {filteredAssets.length} result{filteredAssets.length !== 1 ? "s" : ""}
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden border-border/50">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                   <Skeleton className="h-12 w-12 rounded-lg" />
                   <div className="space-y-2">
                      <Skeleton className="h-4 w-[120px]" />
                      <Skeleton className="h-3 w-[80px]" />
                   </div>
                </div>
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
              <div className="p-4 bg-muted/20 border-t border-border/50">
                 <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/50 bg-card/30 p-8 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="rounded-full bg-primary/10 p-6 text-primary ring-8 ring-primary/5">
            <Package className="h-10 w-10" />
          </div>
          <div className="max-w-md space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">No assets found</h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery
                ? "We couldn't find any assets matching your search. Try adjusting the keywords."
                : "You don't have any assets assigned to you at the moment."}
            </p>
          </div>
          {(searchQuery || statusFilter !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="mt-2"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedAssets.map((asset, index) => {
            const hasActiveIssue = asset.maintenanceLogs?.some(
              (log) => (log.status === "SCHEDULED" || log.status === "IN_PROGRESS") && log.type === "ISSUE_REPORT"
            );
            
            return (
              <Card 
                key={asset.id} 
                className={cn(
                  "group relative overflow-hidden transition-all duration-500",
                  "border-border/40 bg-card/60 backdrop-blur-md",
                  "hover:border-primary/50 hover:shadow-[0_8px_30px_-10px_rgba(var(--primary),0.2)]",
                  "hover:-translate-y-1",
                  "animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Futuristic Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Decorative top glow */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />

                <CardHeader className="p-5 pb-3 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-muted/50 to-muted/10 border border-white/10 shadow-inner group-hover:from-primary/20 group-hover:to-primary/5 group-hover:border-primary/30 transition-all duration-300">
                        <Box className="h-6 w-6 text-foreground/70 group-hover:text-primary transition-colors duration-300" />
                         {hasActiveIssue && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                            </span>
                         )}
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-base font-bold tracking-tight leading-none truncate max-w-[140px] group-hover:text-primary transition-colors duration-300" title={asset.name}>
                          {asset.name}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(var(--primary),0.6)] transition-all duration-300" />
                            <span className="truncate max-w-[120px]">{asset.category?.name || "Uncategorized"}</span>
                        </div>
                      </div>
                    </div>
                     <div className="scale-90 origin-right transition-transform group-hover:scale-100">
                       <StatusBadge status={asset.status} />
                     </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-2 space-y-4 relative z-10">
                  {/* Tech divider */}
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold flex items-center gap-1.5">
                        <Barcode className="h-3 w-3 text-primary/60" /> Serial
                      </span>
                      <div className="font-mono text-[10px] text-foreground/90 truncate bg-primary/5 border border-primary/10 rounded-md px-2 py-1.5 relative overflow-hidden group-hover:border-primary/30 transition-colors">
                        <span className="relative z-10">{asset.serialNumber || "N/A"}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold flex items-center gap-1.5">
                        <Package className="h-3 w-3 text-primary/60" /> Condition
                      </span>
                       <p className="text-xs font-medium text-foreground/90 pl-1 capitalize flex items-center h-full">
                        {asset.condition || "Good"}
                       </p>
                    </div>

                    <div className="space-y-1.5 col-span-2">
                       <span className="text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-primary/60" /> Assigned
                      </span>
                      <p className="text-xs font-medium text-foreground/80 pl-1">
                         {asset.createdAt ? format(new Date(asset.createdAt), "PPP") : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 bg-transparent relative z-10 grid grid-cols-2 gap-2">
                  <Button 
                    className="w-full group/btn relative overflow-hidden border-primary/20 hover:border-primary/50 text-foreground hover:text-primary-foreground bg-background hover:bg-primary transition-all duration-300" 
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(asset)}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Details 
                      <Layers className="h-3 w-3 group-hover/btn:rotate-180 transition-transform duration-500" />
                    </span>
                  </Button>
                  <Button 
                    className="w-full group/btn relative overflow-hidden border-destructive/20 hover:border-destructive/50 text-foreground hover:text-destructive-foreground bg-background hover:bg-destructive transition-all duration-300" 
                    variant="outline"
                    size="sm"
                    onClick={() => handleReturnAsset(asset)}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                       Return
                       <Package className="h-3 w-3" />
                    </span>
                  </Button>
                </CardFooter>
            </Card>
            );
          })}
        </div>
      )}

      {/* Return Asset Dialog */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Package className="h-5 w-5" />
              </div>
              Return Asset
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to return <span className="font-medium text-foreground">{selectedAsset?.name}</span>? 
              This will notify the store manager.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="return-notes">Notes (Optional)</Label>
              <Textarea
                id="return-notes"
                placeholder="Reason for return, condition notes, etc."
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsReturnDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitReturnRequest} 
              disabled={createReturn.isPending}
            >
              {createReturn.isPending ? "Submitting..." : "Confirm Return"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Report Issue Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              Report Issue
            </DialogTitle>
            <DialogDescription>
              Describe the problem with <span className="font-medium text-foreground">{selectedAsset?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="issue">Issue Description</Label>
              <Textarea
                id="issue"
                placeholder="E.g., device not turning on, screen flickering..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="min-h-[120px] resize-none focus-visible:ring-destructive/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={submitIssueReport} 
              disabled={!issueDescription.trim() || createMaintenance.isPending}
            >
              {createMaintenance.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Asset Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl overflow-hidden">
          <DialogHeader className="border-b pb-4 mb-0">
             <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/10">
                  <Box className="h-6 w-6 text-primary" />
                </div>
                <div>
                   <DialogTitle className="text-xl">{selectedAsset?.name}</DialogTitle>
                   <DialogDescription className="mt-1 flex items-center gap-2">
                      <Barcode className="h-3 w-3" />
                      {selectedAsset?.barcode || selectedAsset?.serialNumber || 'No ID'}
                   </DialogDescription>
                </div>
             </div>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] -mx-6 px-6">
          {selectedAsset && (
            <div className="grid gap-6 py-6 md:grid-cols-2">
              <div className="space-y-5">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    Asset Information
                  </h4>
                  <div className="grid gap-4 rounded-xl border bg-card p-4 shadow-sm">
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium text-right">{selectedAsset.category?.name}</span>
                    </div>
                    <div className="h-px w-full bg-border/50" />
                    <div className="grid grid-cols-2 gap-1 text-sm items-center">
                      <span className="text-muted-foreground">Status</span>
                      <div className="flex justify-end">
                         <StatusBadge status={selectedAsset.status} />
                      </div>
                    </div>
                     <div className="h-px w-full bg-border/50" />
                    <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="text-muted-foreground">Model</span>
                        <span className="font-medium text-right">{(selectedAsset.specifications as any)?.model || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                 <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Dates & Info
                  </h4>
                   <div className="grid gap-4 rounded-xl border bg-card p-4 shadow-sm">
                     <div className="grid grid-cols-2 gap-1 text-sm">
                      <span className="text-muted-foreground">Assigned Date</span>
                      <span className="font-medium text-right">
                         {/* We might not have this in the Asset type directly depending on backend mapping, assuming created for now if not available */}
                         {selectedAsset.createdAt ? format(new Date(selectedAsset.createdAt), "PP") : 'N/A'}
                      </span>
                    </div>
                     <div className="h-px w-full bg-border/50" />
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <span className="text-muted-foreground">Purchase Date</span>
                      <span className="font-medium text-right">
                        {selectedAsset.purchaseDate 
                          ? format(new Date(selectedAsset.purchaseDate), "PP") 
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    Technical Specs
                  </h4>
                   <div className="grid gap-4 rounded-xl border bg-card p-4 shadow-sm">
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <span className="text-muted-foreground">Serial Number</span>
                      <span className="font-medium text-right font-mono text-xs bg-muted py-0.5 px-2 rounded inline-block justify-self-end w-fit">
                        {selectedAsset.serialNumber || 'N/A'}
                      </span>
                    </div>
                     <div className="h-px w-full bg-border/50" />
                    <div className="grid grid-cols-2 gap-1 text-sm items-center">
                      <span className="text-muted-foreground">Condition</span>
                      <div className="flex justify-end">
                        <Badge variant="outline" className="font-normal">{selectedAsset.condition || 'Good'}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                 <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                    Description
                  </h4>
                  <div className="rounded-xl border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground min-h-[100px]">
                    {selectedAsset.description || "No description provided."}
                  </div>
                </div>
              </div>
            </div>
          )}
          </ScrollArea>

          <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
             <Button variant="outline" className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" onClick={() => {
                setIsDetailsDialogOpen(false);
                handleReportIssue(selectedAsset!);
             }}>
              <AlertTriangle className="h-4 w-4" />
              Report Issue
            </Button>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
