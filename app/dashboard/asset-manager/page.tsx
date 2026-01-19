"use client";

import { useAppStore } from "@/store/useAppStore";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function AssetManagerDashboard() {
  const { assets, maintenanceRecords, currentUser } = useAppStore();

  const totalAssets = assets.length;
  const activeAssets = assets.filter((a) => a.status === "IN_USE").length;
  const pendingMaintenance = maintenanceRecords.filter(
    (m) => m.status === "PENDING"
  ).length;
  const inProgressMaintenance = maintenanceRecords.filter(
    (m) => m.status === "IN_PROGRESS"
  ).length;

  const recentAssets = assets.slice(0, 5);
  const recentMaintenance = maintenanceRecords.slice(0, 5);

  const assetsByCategory = assets.reduce(
    (acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Manager Dashboard"
        description={`Welcome back, ${currentUser?.name || "Asset Manager"}`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Assets"
          value={totalAssets}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Assets"
          value={activeAssets}
          icon={CheckCircle}
          description="Currently in use"
        />
        <StatsCard
          title="Pending Maintenance"
          value={pendingMaintenance}
          icon={Clock}
          description="Awaiting action"
        />
        <StatsCard
          title="In Progress"
          value={inProgressMaintenance}
          icon={Wrench}
          description="Being serviced"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
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

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
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
                      <p className="font-medium capitalize">
                        {record.type.toLowerCase().replace("_", " ")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.scheduledDate).toLocaleDateString()}
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
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Assets by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(assetsByCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground capitalize">
                    {category.toLowerCase().replace("_", " ")}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${(count / totalAssets) * 100}%`,
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

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
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

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Asset Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-sm">Excellent</span>
                </div>
                <span className="font-medium">
                  {assets.filter((a) => a.condition === "EXCELLENT").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Good</span>
                </div>
                <span className="font-medium">
                  {assets.filter((a) => a.condition === "GOOD").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-sm">Fair</span>
                </div>
                <span className="font-medium">
                  {assets.filter((a) => a.condition === "FAIR").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm">Poor</span>
                </div>
                <span className="font-medium">
                  {assets.filter((a) => a.condition === "POOR").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
