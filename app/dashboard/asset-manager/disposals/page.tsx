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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import type { DisposalMethod } from "@/types";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

export default function DisposalsPage() {
  const { disposalRecords, assets, users, addDisposalRecord, updateDisposalRecord } =
    useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  const [newDisposal, setNewDisposal] = useState({
    assetId: "",
    method: "SALE" as DisposalMethod,
    reason: "",
  });

  const disposableAssets = assets.filter(
    (a) => a.condition === "POOR" || a.status === "MAINTENANCE"
  );

  const filteredRecords = disposalRecords.filter((record) => {
    const asset = assets.find((a) => a.id === record.assetId);
    const matchesSearch =
      asset?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingRecords = disposalRecords.filter((r) => r.status === "PENDING");
  const approvedRecords = disposalRecords.filter((r) => r.status === "APPROVED");
  const completedRecords = disposalRecords.filter((r) => r.status === "COMPLETED");

  const handleRequestDisposal = () => {
    const asset = assets.find((a) => a.id === newDisposal.assetId);
    if (!asset) return;

    addDisposalRecord({
      assetId: newDisposal.assetId,
      method: newDisposal.method,
      reason: newDisposal.reason,
      estimatedValue: asset.currentValue * 0.1,
      status: "PENDING",
    });
    setIsRequestDialogOpen(false);
    setNewDisposal({
      assetId: "",
      method: "SALE",
      reason: "",
    });
  };

  const getAssetName = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    return asset?.name || "Unknown Asset";
  };

  const getApproverName = (approverId?: string) => {
    if (!approverId) return "-";
    const approver = users.find((u) => u.id === approverId);
    return approver?.name || "Unknown";
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        <PageHeader
          title="Asset Disposal"
          description="Manage asset disposal requests and approvals"
          action={
            <Dialog
              open={isRequestDialogOpen}
              onOpenChange={setIsRequestDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Request Disposal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Request Asset Disposal</DialogTitle>
                  <DialogDescription>
                    Submit a disposal request for an asset.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="asset">Asset to Dispose</Label>
                    <Select
                      value={newDisposal.assetId}
                      onValueChange={(value) =>
                        setNewDisposal({ ...newDisposal, assetId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {disposableAssets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id}>
                            {asset.name} - {asset.condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="method">Disposal Method</Label>
                    <Select
                      value={newDisposal.method}
                      onValueChange={(value) =>
                        setNewDisposal({
                          ...newDisposal,
                          method: value as DisposalMethod,
                        })
                      }
                    >
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
                    <Label htmlFor="reason">Reason for Disposal</Label>
                    <Textarea
                      id="reason"
                      value={newDisposal.reason}
                      onChange={(e) =>
                        setNewDisposal({ ...newDisposal, reason: e.target.value })
                      }
                      placeholder="Explain why this asset should be disposed"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsRequestDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleRequestDisposal}>Submit Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingRecords.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
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
                  <p className="text-2xl font-bold">{approvedRecords.length}</p>
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
                  <p className="text-2xl font-bold">{completedRecords.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{disposableAssets.length}</p>
                  <p className="text-sm text-muted-foreground">Assets for Disposal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg font-semibold">
                Disposal Records ({filteredRecords.length})
              </CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Asset</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Estimated Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approver</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                            <Trash2 className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {getAssetName(record.assetId)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(record.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {record.method.toLowerCase()}
                      </TableCell>
                      <TableCell className="max-w-32 truncate">
                        {record.reason}
                      </TableCell>
                      <TableCell>
                        ${record.estimatedValue?.toLocaleString() || "-"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={record.status} />
                      </TableCell>
                      <TableCell>{getApproverName(record.approvedBy)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {record.status === "PENDING" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-emerald-500 hover:text-emerald-600"
                                onClick={() =>
                                  updateDisposalRecord(record.id, {
                                    status: "APPROVED",
                                  })
                                }
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                onClick={() =>
                                  updateDisposalRecord(record.id, {
                                    status: "REJECTED",
                                  })
                                }
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}
