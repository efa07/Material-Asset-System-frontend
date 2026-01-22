"use client";

import { useAppStore } from "@/store/useAppStore";
import { useAssets, useAssignments, useNotifications } from "@/hooks/useQueries";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChartGradient } from "@/components/dashboard/area-chart-gradient";
import {
  Package,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Plus,
  FileText,
  Bell,
} from "lucide-react";
import Link from "next/link";

export default function EmployeeDashboard() {
  const { user: currentUser } = useAppStore();
  const { data: assets = [] } = useAssets();
  const { data: assignments = [] } = useAssignments();
  const { data: notifications = [] } = useNotifications();

  const myAssignments = assignments.filter(
    (a) => a.userId === currentUser?.id && a.status === "ACTIVE"
  );
  const pendingRequests = assignments.filter(
    (a) => a.userId === currentUser?.id && a.status === "PENDING"
  );
  const myNotifications = notifications.filter(
    (n) => n.userId === currentUser?.id && !n.read
  );

  const engagementTrend = [
    { month: "Jan", requests: 6 },
    { month: "Feb", requests: 8 },
    { month: "Mar", requests: 7 },
    { month: "Apr", requests: 9 },
    { month: "May", requests: 11 },
    { month: "Jun", requests: 10 },
  ];

  const getAssetDetails = (assetId: string) => {
    return assets.find((a) => a.id === assetId);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Dashboard"
        description={`Welcome back, ${currentUser?.name || "Employee"}`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="My Assets"
          value={myAssignments.length}
          icon={<Package className="h-5 w-5" />}
          description="Currently assigned"
          trend={{ value: 4.5, label: "utilization" }}
        />
        <StatsCard
          title="Pending Requests"
          value={pendingRequests.length}
          icon={<Clock className="h-5 w-5" />}
          description="Awaiting approval"
          trend={{ value: -1.2, label: "vs last month" }}
        />
        <StatsCard
          title="Notifications"
          value={myNotifications.length}
          icon={<Bell className="h-5 w-5" />}
          description="Unread"
        />
        <StatsCard
          title="Total Assigned"
          value={
            assignments.filter((a) => a.userId === currentUser?.id).length
          }
          icon={<CheckCircle className="h-5 w-5" />}
          description="All time"
          trend={{ value: 2.1, label: "lifetime growth" }}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Engagement Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Requests raised over time</p>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            View history
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <AreaChartGradient data={engagementTrend} xKey="month" yKey="requests" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              My Assigned Assets
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/employee/my-assets">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myAssignments.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No assets currently assigned</p>
                </div>
              ) : (
                myAssignments.slice(0, 5).map((assignment) => {
                  const asset = getAssetDetails(assignment.assetId);
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {asset?.name || "Unknown Asset"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {asset?.serialNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={assignment.status} />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Since{" "}
                          {new Date(assignment.assignedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Pending Requests
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/employee/requests">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No pending requests</p>
                </div>
              ) : (
                pendingRequests.slice(0, 5).map((request) => {
                  const asset = getAssetDetails(request.assetId);
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                          <Clock className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {asset?.name || "Asset Request"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Requested{" "}
                            {new Date(request.assignedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status="PENDING" />
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col py-4 bg-transparent" asChild>
              <Link href="/dashboard/employee/request">
                <Plus className="mb-2 h-6 w-6" />
                <span>Request Asset</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4 bg-transparent" asChild>
              <Link href="/dashboard/employee/my-assets">
                <Package className="mb-2 h-6 w-6" />
                <span>My Assets</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4 bg-transparent" asChild>
              <Link href="/dashboard/employee/report-issue">
                <FileText className="mb-2 h-6 w-6" />
                <span>Report Issue</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col py-4 bg-transparent" asChild>
              <Link href="/dashboard/employee/notifications">
                <Bell className="mb-2 h-6 w-6" />
                <span>Notifications</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
