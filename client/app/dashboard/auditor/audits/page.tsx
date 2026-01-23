"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardCheck,
  Plus,
  Search,
  Filter,
  Eye,
  Play,
  CheckCircle,
  Clock,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useStores } from '@/hooks/useQueries';

export default function AuditorAuditsPage() {
  const { data: stores = [] } = useStores();

  const auditRecords: Array<{
    id: string;
    storeId: string;
    type: string;
    auditDate: string;
    status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
    assetsAudited?: number;
    discrepanciesFound?: number;
    findings?: string;
  }> = [
    { id: "a1", storeId: "1", type: "PERIODIC", auditDate: "2025-01-10", status: "COMPLETED", assetsAudited: 120, discrepanciesFound: 2, findings: "2 minor discrepancies resolved." },
    { id: "a2", storeId: "2", type: "COMPLIANCE", auditDate: "2025-01-18", status: "IN_PROGRESS", assetsAudited: 60, discrepanciesFound: 1, findings: "Ongoing." },
    { id: "a3", storeId: "3", type: "RANDOM", auditDate: "2025-02-05", status: "SCHEDULED" },
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewAuditDialogOpen, setIsNewAuditDialogOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<
    (typeof auditRecords)[0] | null
  >(null);

  const [newAudit, setNewAudit] = useState({
    storeId: "",
    type: "PERIODIC",
    auditDate: "",
    notes: "",
  });

  const filteredAudits = auditRecords.filter((audit) => {
    const store = stores.find((s) => s.id === audit.storeId);
    const matchesSearch =
      store?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || audit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const scheduledAudits = filteredAudits.filter((a) => a.status === "SCHEDULED");
  const inProgressAudits = filteredAudits.filter(
    (a) => a.status === "IN_PROGRESS"
  );
  const completedAudits = filteredAudits.filter((a) => a.status === "COMPLETED");

  const getStoreName = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    return store?.name || "Unknown Store";
  };

  const handleCreateAudit = () => {
    setIsNewAuditDialogOpen(false);
    setNewAudit({
      storeId: "",
      type: "PERIODIC",
      auditDate: "",
      notes: "",
    });
  };

  const handleStartAudit = (auditId: string) => {
    // mock-only
  };

  const handleCompleteAudit = (auditId: string) => {
    // mock-only
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Management"
        description="Schedule, conduct, and review audits"
      >
          <Dialog
            open={isNewAuditDialogOpen}
            onOpenChange={setIsNewAuditDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Audit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Schedule New Audit</DialogTitle>
                <DialogDescription>
                  Create a new audit schedule for a store.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="store">Store</Label>
                  <Select
                    value={newAudit.storeId}
                    onValueChange={(value) =>
                      setNewAudit({ ...newAudit, storeId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Audit Type</Label>
                    <Select
                      value={newAudit.type}
                      onValueChange={(value) =>
                        setNewAudit({ ...newAudit, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERIODIC">Periodic</SelectItem>
                        <SelectItem value="RANDOM">Random</SelectItem>
                        <SelectItem value="COMPLIANCE">Compliance</SelectItem>
                        <SelectItem value="SPECIAL">Special</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="auditDate">Audit Date</Label>
                    <Input
                      id="auditDate"
                      type="date"
                      value={newAudit.auditDate}
                      onChange={(e) =>
                        setNewAudit({ ...newAudit, auditDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newAudit.notes}
                    onChange={(e) =>
                      setNewAudit({ ...newAudit, notes: e.target.value })
                    }
                    placeholder="Any special instructions or focus areas..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsNewAuditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateAudit}>Schedule Audit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      </PageHeader>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{scheduledAudits.length}</p>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <ClipboardCheck className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inProgressAudits.length}</p>
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
                  <p className="text-2xl font-bold">{completedAudits.length}</p>
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
                  <p className="text-2xl font-bold">
                    {auditRecords.reduce(
                      (sum, a) => sum + (a.discrepanciesFound || 0),
                      0
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg font-semibold">
                Audit Records
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
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <AuditTable
                  audits={filteredAudits}
                  getStoreName={getStoreName}
                  onStart={handleStartAudit}
                  onComplete={handleCompleteAudit}
                  onView={setSelectedAudit}
                />
              </TabsContent>
              <TabsContent value="scheduled">
                <AuditTable
                  audits={scheduledAudits}
                  getStoreName={getStoreName}
                  onStart={handleStartAudit}
                  onComplete={handleCompleteAudit}
                  onView={setSelectedAudit}
                />
              </TabsContent>
              <TabsContent value="in-progress">
                <AuditTable
                  audits={inProgressAudits}
                  getStoreName={getStoreName}
                  onStart={handleStartAudit}
                  onComplete={handleCompleteAudit}
                  onView={setSelectedAudit}
                />
              </TabsContent>
              <TabsContent value="completed">
                <AuditTable
                  audits={completedAudits}
                  getStoreName={getStoreName}
                  onStart={handleStartAudit}
                  onComplete={handleCompleteAudit}
                  onView={setSelectedAudit}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Dialog open={!!selectedAudit} onOpenChange={() => setSelectedAudit(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Audit Details</DialogTitle>
              <DialogDescription>
                Complete audit information
              </DialogDescription>
            </DialogHeader>
            {selectedAudit && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Store</p>
                    <p className="font-medium">
                      {getStoreName(selectedAudit.storeId)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">
                      {selectedAudit.type.toLowerCase()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge status={selectedAudit.status} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(selectedAudit.auditDate).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedAudit.assetsAudited && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Assets Audited
                      </p>
                      <p className="font-medium">{selectedAudit.assetsAudited}</p>
                    </div>
                  )}
                  {selectedAudit.discrepanciesFound !== undefined && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Discrepancies
                      </p>
                      <p className="font-medium text-red-500">
                        {selectedAudit.discrepanciesFound}
                      </p>
                    </div>
                  )}
                </div>
                {selectedAudit.findings && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Findings</p>
                    <p>{selectedAudit.findings}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedAudit(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}

function AuditTable({
  audits,
  getStoreName,
  onStart,
  onComplete,
  onView,
}: {
  audits: ReturnType<typeof useAppStore>["auditRecords"];
  getStoreName: (id: string) => string;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onView: (audit: (typeof audits)[0]) => void;
}) {
  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead>Store</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Assets Audited</TableHead>
            <TableHead>Issues</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.map((audit) => (
            <TableRow key={audit.id} className="group">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      audit.status === "COMPLETED"
                        ? "bg-emerald-500/10"
                        : audit.status === "IN_PROGRESS"
                          ? "bg-blue-500/10"
                          : "bg-amber-500/10"
                    }`}
                  >
                    <ClipboardCheck
                      className={`h-5 w-5 ${
                        audit.status === "COMPLETED"
                          ? "text-emerald-500"
                          : audit.status === "IN_PROGRESS"
                            ? "text-blue-500"
                            : "text-amber-500"
                      }`}
                    />
                  </div>
                  <p className="font-medium">{getStoreName(audit.storeId)}</p>
                </div>
              </TableCell>
              <TableCell className="capitalize">
                {audit.type.toLowerCase()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  {new Date(audit.auditDate).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>{audit.assetsAudited || "-"}</TableCell>
              <TableCell>
                {audit.discrepanciesFound !== undefined ? (
                  <span
                    className={
                      audit.discrepanciesFound > 0 ? "text-red-500" : ""
                    }
                  >
                    {audit.discrepanciesFound}
                  </span>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={audit.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(audit)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {audit.status === "SCHEDULED" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onStart(audit.id)}
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Start
                    </Button>
                  )}
                  {audit.status === "IN_PROGRESS" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onComplete(audit.id)}
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Complete
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
