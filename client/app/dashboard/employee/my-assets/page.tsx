"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Package,
  Search,
  Eye,
  AlertTriangle,
  Calendar,
  QrCode,
} from "lucide-react";
import type { Asset } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { useAssignments } from "@/hooks/useQueries";

export default function EmployeeMyAssetsPage() {
  const { user } = useAppStore();
  const { data: assignments = [] } = useAssignments();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");

  const myAssets = assignments
    .filter((a) => a.userId === user?.id && a.status === 'ACTIVE' && a.asset)
    .map((a) => a.asset!);

  const filteredAssets = myAssets.filter((asset) => {
    return (
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.serialNumber || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleReportIssue = () => {
    // In a real app, this would create a maintenance request
    setIsReportDialogOpen(false);
    setIssueDescription("");
    setSelectedAsset(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Assigned Assets"
        description="View and manage assets assigned to you (mock)"
      />

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg font-semibold">
                Assets ({filteredAssets.length})
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAssets.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Package className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p className="text-lg font-medium">No assets assigned</p>
                <p className="text-sm">
                  Contact your manager to request equipment
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAssets.map((asset) => {
                  return (
                    <div
                      key={asset.id}
                      className="rounded-xl border border-border/50 bg-background/50 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{asset.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {asset.serialNumber}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={asset.condition} type="condition" />
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Category</span>
                          <span className="capitalize">
                              {asset.categoryId}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                              Status
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                              {asset.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => setSelectedAsset(asset)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => {
                            setSelectedAsset(asset);
                            setIsReportDialogOpen(true);
                          }}
                        >
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Report Issue
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog
          open={!!selectedAsset && !isReportDialogOpen}
          onOpenChange={() => setSelectedAsset(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Asset Details</DialogTitle>
              <DialogDescription>
                Complete information about this asset
              </DialogDescription>
            </DialogHeader>
            {selectedAsset && (
              <div className="grid gap-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedAsset.name}</h3>
                    <p className="text-muted-foreground">
                      {selectedAsset.serialNumber}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge status={selectedAsset.status} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <StatusBadge
                      status={selectedAsset.condition}
                      type="condition"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium capitalize">
                      {selectedAsset.category.toLowerCase().replace("_", " ")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Purchase Date</p>
                    <p className="font-medium">
                      {new Date(selectedAsset.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {selectedAsset.description && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p>{selectedAsset.description}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedAsset(null)}>
                Close
              </Button>
              <Button
                onClick={() => setIsReportDialogOpen(true)}
                variant="destructive"
              >
                Report Issue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report an Issue</DialogTitle>
              <DialogDescription>
                Describe the problem with {selectedAsset?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="issue">Issue Description</Label>
                <Textarea
                  id="issue"
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe the problem in detail..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsReportDialogOpen(false);
                  setIssueDescription("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleReportIssue}>Submit Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}
