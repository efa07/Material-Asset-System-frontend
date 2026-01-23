"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChartGradient } from "@/components/dashboard/area-chart-gradient";
import {
  Package,
  Wrench,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Clock,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useAssets, useCategories, useMaintenanceTasks } from "@/hooks/useQueries";

export default function AssetManagerDashboard() {
  const { user } = useAppStore();
  const { data: assets, isLoading: assetsLoading } = useAssets();
  const { data: categories } = useCategories();
  const { data: maintenanceTasks, isLoading: maintenanceLoading } = useMaintenanceTasks();

  if (assetsLoading || maintenanceLoading) {
    return <div>Loading...</div>;
  }

  const totalAssets = assets?.length || 0;
  const activeAssets = (assets || []).filter((a) => a.status === "IN_USE").length;
  const pendingMaintenance = (maintenanceTasks || []).filter((m) => m.status === "SCHEDULED").length;
  const inProgressMaintenance = (maintenanceTasks || []).filter((m) => m.status === "IN_PROGRESS").length;

  const recentAssets = (assets || []).slice(0, 5);
  const recentMaintenance = (maintenanceTasks || []).slice(0, 5);

  const assetsByCategory = (assets || []).reduce((acc, asset) => {
    const name = asset.category?.name ||
      categories?.find((c) => c.id === asset.categoryId)?.name ||
      "Uncategorized";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const lifecycleTrend = (() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth() + 1}`,
        month: date.toLocaleString("default", { month: "short" }),
        onboarded: 0,
      };
    });

    (assets || []).forEach((asset) => {
      if (!asset.createdAt) return;
      const created = new Date(asset.createdAt);
      const key = `${created.getFullYear()}-${created.getMonth() + 1}`;
      const bucket = months.find((m) => m.key === key);
      if (bucket) bucket.onboarded += 1;
    });

    return months.map(({ key, ...rest }) => rest);
  })();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Manager Dashboard"
        description={`Welcome back, ${user?.name || "Asset Manager"}`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Assets"
          value={totalAssets}
          icon={<Package className="h-5 w-5" />}
          trend={{ value: 12, label: "vs last quarter" }}
        />
        <StatsCard
          title="Active Assets"
          value={activeAssets}
          icon={<CheckCircle className="h-5 w-5" />}
          description="Currently in use"
          trend={{ value: 6.2, label: "utilization lift" }}
        />
        <StatsCard
          title="Pending Maintenance"
          value={pendingMaintenance}
          icon={<Clock className="h-5 w-5" />}
          description="Awaiting action"
          trend={{ value: -2.4, label: "since last week" }}
        />
        <StatsCard
          title="In Progress"
          value={inProgressMaintenance}
          icon={<Wrench className="h-5 w-5" />}
          description="Being serviced"
          trend={{ value: 3.1, label: "cycle velocity" }}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Asset Velocity</CardTitle>
            <p className="text-sm text-muted-foreground">
              Onboarded assets over the last 6 months
            </p>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            Export
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <AreaChartGradient data={lifecycleTrend} xKey="month" yKey="onboarded" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Recent Assets
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/asset-manager/assets">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {asset.serialNumber}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={asset.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Maintenance Queue
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/asset-manager/maintenance">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMaintenance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                      <Wrench className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{record.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.maintenanceDate
                          ? new Date(record.maintenanceDate).toLocaleDateString()
                          : "Unscheduled"}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={record.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Assets by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(assetsByCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${totalAssets ? (count / totalAssets) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <Link href="/dashboard/asset-manager/assets">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Assets
                </Link>
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <Link href="/dashboard/asset-manager/maintenance">
                  <Wrench className="mr-2 h-4 w-4" />
                  Schedule Maintenance
                </Link>
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <Link href="/dashboard/asset-manager/disposals">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Review Disposals
                </Link>
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <Link href="/dashboard/asset-manager/reports">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate Reports
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Asset Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-sm">Available</span>
                </div>
                <span className="font-medium">
                  {(assets || []).filter((a) => a.status === "AVAILABLE").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">In Use</span>
                </div>
                <span className="font-medium">
                  {(assets || []).filter((a) => a.status === "IN_USE").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-sm">Maintenance</span>
                </div>
                <span className="font-medium">
                  {(assets || []).filter((a) => a.status === "MAINTENANCE").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm">Disposed</span>
                </div>
                <span className="font-medium">
                  {(assets || []).filter((a) => a.status === "DISPOSED").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
