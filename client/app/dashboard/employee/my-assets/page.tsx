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

import type { Asset } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { useUser } from "@/hooks/useQueries";
import { useCreateMaintenance } from "@/hooks/useMutations";
import { cn } from "@/lib/utils";

export default function EmployeeMyAssetsPage() {
  const { user: currentUser } = useAppStore();
  const { data: user, isLoading, error } = useUser(currentUser?.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");

  const createMaintenance = useCreateMaintenance();

  const myAssets = user?.currentAssets || [];

  const filteredAssets = myAssets.filter((asset) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      asset.name.toLowerCase().includes(searchLower) ||
      (asset.serialNumber || "").toLowerCase().includes(searchLower) ||
      (asset.category?.name || "").toLowerCase().includes(searchLower)
    );
  });

  const handleReportIssue = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsReportDialogOpen(true);
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
      status: "SCHEDULED"
    }, {
      onSuccess: () => {
        setIsReportDialogOpen(false);
        setIssueDescription("");
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
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative flex-1 md:w-72">
             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 border-input/50 backdrop-blur-sm focus-visible:bg-background transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

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
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-2">
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAssets.map((asset, index) => {
             const hasActiveIssue = asset.maintenanceLogs?.some(
              (log) => (log.status === "SCHEDULED" || log.status === "IN_PROGRESS") && log.type === "ISSUE_REPORT"
            );
            
            return (
            <Card 
              key={asset.id} 
              className={cn(
                "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm",
                "animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
              
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-background border shadow-sm group-hover:border-primary/30 group-hover:shadow-md transition-all">
                      <Box className="h-6 w-6 text-primary" />
                       {hasActiveIssue && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                          </span>
                       )}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold leading-none truncate max-w-[140px]" title={asset.name}>
                        {asset.name}
                      </CardTitle>
                      <CardDescription className="text-xs truncate max-w-[140px] flex items-center gap-1.5">
                        <Layers className="h-3 w-3" />
                        {asset.category?.name || "Uncategorized"}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-2 space-y-4">
                <div className="h-px w-full bg-border/50" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1">
                      <Barcode className="h-3 w-3" /> Serial
                    </span>
                    <p className="font-mono text-xs font-medium truncate bg-muted/50 p-1 px-2 rounded-md border border-border/50" title={asset.serialNumber || "N/A"}>
                      {asset.serialNumber || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1">
                       <Activity className="h-3 w-3" /> Status
                    </span>
                    <div className="flex">
                      <StatusBadge status={asset.status} />
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 bg-transparent">
                <Button 
                  className="w-full gap-2 transition-all bg-secondary/50 hover:bg-secondary text-secondary-foreground border-0 shadow-none hover:shadow-sm" 
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(asset)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          )})}
        </div>
      )}

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
