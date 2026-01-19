"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  Search,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { AssetCategory } from "@/types";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

export default function EmployeeRequestPage() {
  const { assets, assignments, currentUser, addAssignment } = useAppStore();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [requestReason, setRequestReason] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const availableAssets = assets.filter((a) => a.status === "AVAILABLE");

  const filteredAssets = availableAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || asset.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const myPendingRequests = assignments.filter(
    (a) => a.userId === currentUser?.id && a.status === "PENDING"
  );

  const handleSubmitRequest = () => {
    if (!selectedAssetId || !currentUser) return;

    addAssignment({
      assetId: selectedAssetId,
      userId: currentUser.id,
      assignedDate: new Date().toISOString(),
      status: "PENDING",
    });

    setRequestSubmitted(true);
    setSelectedAssetId(null);
    setRequestReason("");

    setTimeout(() => setRequestSubmitted(false), 3000);
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        <PageHeader
          title="Request Asset"
          description="Browse available assets and submit a request"
        />

        {requestSubmitted && (
          <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="font-medium text-emerald-500">Request Submitted</p>
                <p className="text-sm text-muted-foreground">
                  Your request has been sent for approval.
                </p>
              </div>
            </div>
          </div>
        )}

        {myPendingRequests.length > 0 && (
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5 text-amber-500" />
                Pending Requests ({myPendingRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {myPendingRequests.map((request) => {
                  const asset = assets.find((a) => a.id === request.assetId);
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{asset?.name || "Unknown Asset"}</span>
                      </div>
                      <StatusBadge status="PENDING" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Available Assets ({filteredAssets.length})
                  </CardTitle>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search assets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-full sm:w-48"
                      />
                    </div>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="IT_EQUIPMENT">IT Equipment</SelectItem>
                        <SelectItem value="FURNITURE">Furniture</SelectItem>
                        <SelectItem value="VEHICLE">Vehicle</SelectItem>
                        <SelectItem value="OFFICE_SUPPLIES">
                          Office Supplies
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredAssets.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <AlertCircle className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p className="text-lg font-medium">No assets available</p>
                    <p className="text-sm">
                      Check back later or adjust your filters
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {filteredAssets.map((asset) => (
                      <button
                        type="button"
                        key={asset.id}
                        onClick={() => setSelectedAssetId(asset.id)}
                        className={`rounded-lg border p-4 text-left transition-all ${
                          selectedAssetId === asset.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border/50 bg-background/50 hover:border-border hover:bg-background"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              selectedAssetId === asset.id
                                ? "bg-primary/20"
                                : "bg-muted"
                            }`}
                          >
                            <Package
                              className={`h-5 w-5 ${
                                selectedAssetId === asset.id
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{asset.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {asset.serialNumber}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <StatusBadge
                                status={asset.condition}
                                type="condition"
                              />
                              <span className="text-xs text-muted-foreground capitalize">
                                {asset.category.toLowerCase().replace("_", " ")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Submit Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedAssetId ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">
                            {
                              assets.find((a) => a.id === selectedAssetId)
                                ?.name
                            }
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {
                              assets.find((a) => a.id === selectedAssetId)
                                ?.serialNumber
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reason">Reason for Request</Label>
                      <Textarea
                        id="reason"
                        value={requestReason}
                        onChange={(e) => setRequestReason(e.target.value)}
                        placeholder="Explain why you need this asset..."
                        rows={4}
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleSubmitRequest}
                      disabled={!requestReason.trim()}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit Request
                    </Button>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>Select an asset to request</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
