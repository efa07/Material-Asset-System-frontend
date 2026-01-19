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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import type { MaintenanceType } from "@/types";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

export default function MaintenancePage() {
  const searchParams = useSearchParams();
  const { maintenanceRecords, assets, users, addMaintenanceRecord } =
    useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const [newMaintenance, setNewMaintenance] = useState({
    assetId: "",
    type: "PREVENTIVE" as MaintenanceType,
    description: "",
    scheduledDate: "",
    technicianId: "",
  });

  const technicians = users.filter((u) => u.role === "TECHNICIAN");

  const filteredRecords = maintenanceRecords.filter((record) => {
    const asset = assets.find((a) => a.id === record.assetId);
    const matchesSearch =
      asset?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingRecords = filteredRecords.filter((r) => r.status === "PENDING");
  const inProgressRecords = filteredRecords.filter(
    (r) => r.status === "IN_PROGRESS"
  );
  const completedRecords = filteredRecords.filter(
    (r) => r.status === "COMPLETED"
  );

  const handleScheduleMaintenance = () => {
    addMaintenanceRecord({
      assetId: newMaintenance.assetId,
      type: newMaintenance.type,
      description: newMaintenance.description,
      scheduledDate: newMaintenance.scheduledDate,
      status: "PENDING",
      technicianId: newMaintenance.technicianId || undefined,
    });
    setIsScheduleDialogOpen(false);
    setNewMaintenance({
      assetId: "",
      type: "PREVENTIVE",
      description: "",
      scheduledDate: "",
      technicianId: "",
    });
  };

  const getAssetName = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    return asset?.name || "Unknown Asset";
  };

  const getTechnicianName = (techId?: string) => {
    if (!techId) return "Unassigned";
    const tech = users.find((u) => u.id === techId);
    return tech?.name || "Unknown";
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        <PageHeader
          title="Maintenance Management"
          description="Schedule and track asset maintenance"
          action={
            <Dialog
              open={isScheduleDialogOpen}
              onOpenChange={setIsScheduleDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Maintenance
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Schedule Maintenance</DialogTitle>
                  <DialogDescription>
                    Create a new maintenance schedule for an asset.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="asset">Asset</Label>
                    <Select
                      value={newMaintenance.assetId}
                      onValueChange={(value) =>
                        setNewMaintenance({ ...newMaintenance, assetId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {assets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id}>
                            {asset.name} ({asset.serialNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Maintenance Type</Label>
                      <Select
                        value={newMaintenance.type}
                        onValueChange={(value) =>
                          setNewMaintenance({
                            ...newMaintenance,
                            type: value as MaintenanceType,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                          <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                          <SelectItem value="EMERGENCY">Emergency</SelectItem>
                          <SelectItem value="INSPECTION">Inspection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="scheduledDate">Scheduled Date</Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        value={newMaintenance.scheduledDate}
                        onChange={(e) =>
                          setNewMaintenance({
                            ...newMaintenance,
                            scheduledDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="technician">Assign Technician</Label>
                    <Select
                      value={newMaintenance.technicianId}
                      onValueChange={(value) =>
                        setNewMaintenance({
                          ...newMaintenance,
                          technicianId: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select technician (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newMaintenance.description}
                      onChange={(e) =>
                        setNewMaintenance({
                          ...newMaintenance,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the maintenance work needed"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsScheduleDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleScheduleMaintenance}>
                    Schedule Maintenance
                  </Button>
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
                  <p className="text-sm text-muted-foreground">Pending</p>
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
                  <p className="text-2xl font-bold">{inProgressRecords.length}</p>
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
                  <p className="text-2xl font-bold">
                    {
                      maintenanceRecords.filter((r) => r.type === "EMERGENCY")
                        .length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Emergency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg font-semibold">
                Maintenance Records
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
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <MaintenanceTable
                  records={filteredRecords}
                  getAssetName={getAssetName}
                  getTechnicianName={getTechnicianName}
                />
              </TabsContent>
              <TabsContent value="pending">
                <MaintenanceTable
                  records={pendingRecords}
                  getAssetName={getAssetName}
                  getTechnicianName={getTechnicianName}
                />
              </TabsContent>
              <TabsContent value="in-progress">
                <MaintenanceTable
                  records={inProgressRecords}
                  getAssetName={getAssetName}
                  getTechnicianName={getTechnicianName}
                />
              </TabsContent>
              <TabsContent value="completed">
                <MaintenanceTable
                  records={completedRecords}
                  getAssetName={getAssetName}
                  getTechnicianName={getTechnicianName}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}

function MaintenanceTable({
  records,
  getAssetName,
  getTechnicianName,
}: {
  records: ReturnType<typeof useAppStore>["maintenanceRecords"];
  getAssetName: (id: string) => string;
  getTechnicianName: (id?: string) => string;
}) {
  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead>Asset</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Scheduled Date</TableHead>
            <TableHead>Technician</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="group">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Wrench className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium">{getAssetName(record.assetId)}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-48">
                      {record.description}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="capitalize">
                {record.type.toLowerCase()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(record.scheduledDate).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>{getTechnicianName(record.technicianId)}</TableCell>
              <TableCell>
                <StatusBadge status={record.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {record.status === "PENDING" && (
                    <Button variant="ghost" size="sm">
                      Start
                    </Button>
                  )}
                  {record.status === "IN_PROGRESS" && (
                    <Button variant="ghost" size="sm">
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
