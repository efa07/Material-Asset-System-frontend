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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Wrench,
  Search,
  Filter,
  Play,
  CheckCircle,
  Clock,
  AlertTriangle,
  Package,
  Calendar,
} from "lucide-react";
import { mockAssets, mockMaintenanceTasks } from "@/lib/mock-data";

export default function TechnicianTasksPage() {
  const maintenanceRecords = mockMaintenanceTasks;
  const assets = mockAssets;
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<
    (typeof maintenanceRecords)[0] | null
  >(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [completionCost, setCompletionCost] = useState("");

  const myTasks = maintenanceRecords;

  const filteredTasks = myTasks.filter((task) => {
    const asset = assets.find((a) => a.id === task.assetId);
    const matchesSearch =
      asset?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || task.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const pendingTasks = filteredTasks.filter((t) => t.status === "PENDING");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "IN_PROGRESS");
  const completedTasks = filteredTasks.filter((t) => t.status === "COMPLETED");

  const getAssetDetails = (assetId: string) => {
    return assets.find((a) => a.id === assetId);
  };

  const handleStartTask = (taskId: string) => {
    // mock-only: no persistence
  };

  const handleCompleteTask = () => {
    if (!selectedTask) return;
    setSelectedTask(null);
    setCompletionNotes("");
    setCompletionCost("");
  };

  const TaskCard = ({
    task,
    showActions = true,
  }: {
    task: (typeof maintenanceRecords)[0];
    showActions?: boolean;
  }) => {
    const asset = getAssetDetails(task.assetId);
    return (
      <div className="rounded-lg border border-border/50 bg-background/50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                task.type === "EMERGENCY"
                  ? "bg-red-500/10"
                  : task.status === "IN_PROGRESS"
                    ? "bg-blue-500/10"
                    : "bg-amber-500/10"
              }`}
            >
              {task.type === "EMERGENCY" ? (
                <AlertTriangle
                  className={`h-6 w-6 ${
                    task.type === "EMERGENCY" ? "text-red-500" : "text-amber-500"
                  }`}
                />
              ) : (
                <Wrench
                  className={`h-6 w-6 ${
                    task.status === "IN_PROGRESS"
                      ? "text-blue-500"
                      : "text-amber-500"
                  }`}
                />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{asset?.name || "Unknown Asset"}</h3>
                {task.type === "EMERGENCY" && (
                  <span className="rounded bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">
                    URGENT
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {asset?.serialNumber}
              </p>
              <p className="text-sm">{task.description}</p>
              <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Scheduled:{" "}
                  {new Date(task.scheduledDate).toLocaleDateString()}
                </span>
                <span className="capitalize">Type: {task.type.toLowerCase()}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={task.status} />
            {showActions && task.status === "PENDING" && (
              <Button size="sm" onClick={() => handleStartTask(task.id)}>
                <Play className="mr-1 h-3 w-3" />
                Start
              </Button>
            )}
            {showActions && task.status === "IN_PROGRESS" && (
              <Button size="sm" onClick={() => setSelectedTask(task)}>
                <CheckCircle className="mr-1 h-3 w-3" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Maintenance Tasks"
        description="View and manage your assigned maintenance work (mock)"
      />

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg font-semibold">
                Tasks ({filteredTasks.length})
              </CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                    <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                    <SelectItem value="EMERGENCY">Emergency</SelectItem>
                    <SelectItem value="INSPECTION">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Pending ({pendingTasks.length})
                </TabsTrigger>
                <TabsTrigger value="in-progress" className="gap-2">
                  <Wrench className="h-4 w-4" />
                  In Progress ({inProgressTasks.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Completed ({completedTasks.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <div className="space-y-4">
                  {pendingTasks.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      No pending tasks
                    </div>
                  ) : (
                    pendingTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="in-progress">
                <div className="space-y-4">
                  {inProgressTasks.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      No tasks in progress
                    </div>
                  ) : (
                    inProgressTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="completed">
                <div className="space-y-4">
                  {completedTasks.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      No completed tasks
                    </div>
                  ) : (
                    completedTasks.map((task) => (
                      <TaskCard key={task.id} task={task} showActions={false} />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Maintenance Task</DialogTitle>
              <DialogDescription>
                Add notes and cost details for this maintenance work.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="notes">Completion Notes</Label>
                <Textarea
                  id="notes"
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Describe the work performed..."
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cost">Cost (Optional)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={completionCost}
                  onChange={(e) => setCompletionCost(e.target.value)}
                  placeholder="Enter cost if applicable"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTask(null)}>
                Cancel
              </Button>
              <Button onClick={handleCompleteTask}>Mark as Completed</Button>
            </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
