"use client";

import { useAppStore } from "@/store/useAppStore";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Play,
  Package,
} from "lucide-react";
import Link from "next/link";

export default function TechnicianDashboard() {
  const { maintenanceRecords, assets, currentUser } = useAppStore();

  const myTasks = maintenanceRecords.filter(
    (m) => m.technicianId === currentUser?.id
  );
  const pendingTasks = myTasks.filter((m) => m.status === "PENDING");
  const inProgressTasks = myTasks.filter((m) => m.status === "IN_PROGRESS");
  const completedTasks = myTasks.filter((m) => m.status === "COMPLETED");
  const emergencyTasks = myTasks.filter((m) => m.type === "EMERGENCY");

  const getAssetName = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    return asset?.name || "Unknown Asset";
  };

  const getAssetSerial = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    return asset?.serialNumber || "";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Technician Dashboard"
        description={`Welcome back, ${currentUser?.name || "Technician"}`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Tasks"
          value={pendingTasks.length}
          icon={Clock}
          description="Awaiting action"
        />
        <StatsCard
          title="In Progress"
          value={inProgressTasks.length}
          icon={Wrench}
          description="Currently working"
        />
        <StatsCard
          title="Completed"
          value={completedTasks.length}
          icon={CheckCircle}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Emergency"
          value={emergencyTasks.length}
          icon={AlertTriangle}
          description="High priority"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              My Pending Tasks
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/technician/tasks">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pending tasks assigned
                </p>
              ) : (
                pendingTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          task.type === "EMERGENCY"
                            ? "bg-red-500/10"
                            : "bg-amber-500/10"
                        }`}
                      >
                        {task.type === "EMERGENCY" ? (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        ) : (
                          <Wrench className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {getAssetName(task.assetId)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {task.type} - {getAssetSerial(task.assetId)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={task.status} />
                      <Button size="sm" variant="outline">
                        <Play className="mr-1 h-3 w-3" />
                        Start
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              In Progress
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/technician/tasks">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inProgressTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tasks in progress
                </p>
              ) : (
                inProgressTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                        <Wrench className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {getAssetName(task.assetId)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Started:{" "}
                          {task.startDate
                            ? new Date(task.startDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={task.status} />
                      <Button size="sm">Complete</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col py-4 bg-transparent" asChild>
              <Link href="/dashboard/technician/tasks">
                <Wrench className="mb-2 h-6 w-6" />
                <span>My Tasks</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4 bg-transparent" asChild>
              <Link href="/dashboard/technician/history">
                <CheckCircle className="mb-2 h-6 w-6" />
                <span>Work History</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4 bg-transparent" asChild>
              <Link href="/dashboard/technician/assets">
                <Package className="mb-2 h-6 w-6" />
                <span>Asset Lookup</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4 bg-transparent" asChild>
              <Link href="/dashboard/technician/reports">
                <AlertTriangle className="mb-2 h-6 w-6" />
                <span>Report Issue</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
