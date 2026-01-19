"use client";

import { useAppStore } from "@/store/useAppStore";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  FileText,
  Package,
  DollarSign,
  Wrench,
  Calendar,
} from "lucide-react";
import { useState } from "react";

export default function ReportsPage() {
  const { assets, maintenanceRecords, disposalRecords, assignments } =
    useAppStore();
  const [reportPeriod, setReportPeriod] = useState("month");

  const totalAssetValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
  const totalPurchaseValue = assets.reduce((sum, a) => sum + a.purchasePrice, 0);
  const depreciation = totalPurchaseValue - totalAssetValue;

  const assetsByStatus = {
    AVAILABLE: assets.filter((a) => a.status === "AVAILABLE").length,
    IN_USE: assets.filter((a) => a.status === "IN_USE").length,
    MAINTENANCE: assets.filter((a) => a.status === "MAINTENANCE").length,
    DISPOSED: assets.filter((a) => a.status === "DISPOSED").length,
  };

  const assetsByCategory = assets.reduce(
    (acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const maintenanceCosts = maintenanceRecords
    .filter((m) => m.status === "COMPLETED")
    .reduce((sum, m) => sum + (m.cost || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Generate and view asset management reports"
        action={
          <div className="flex items-center gap-2">
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-40">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Asset Value</p>
                <p className="text-2xl font-bold">
                  ${totalAssetValue.toLocaleString()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <DollarSign className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold">{assets.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Depreciation</p>
                <p className="text-2xl font-bold text-red-500">
                  -${depreciation.toLocaleString()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                <TrendingUp className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance Costs</p>
                <p className="text-2xl font-bold">
                  ${maintenanceCosts.toLocaleString()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                <Wrench className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <PieChart className="h-5 w-5" />
              Assets by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(assetsByStatus).map(([status, count]) => {
                const percentage = Math.round((count / assets.length) * 100) || 0;
                const colors: Record<string, string> = {
                  AVAILABLE: "bg-emerald-500",
                  IN_USE: "bg-blue-500",
                  MAINTENANCE: "bg-amber-500",
                  DISPOSED: "bg-red-500",
                };
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">
                        {status.toLowerCase().replace("_", " ")}
                      </span>
                      <span className="font-medium">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${colors[status]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="h-5 w-5" />
              Assets by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(assetsByCategory).map(([category, count]) => {
                const percentage = Math.round((count / assets.length) * 100) || 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">
                        {category.toLowerCase().replace("_", " ")}
                      </span>
                      <span className="font-medium">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-5 w-5" />
            Available Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Asset Inventory Report",
                description: "Complete list of all assets with current status",
                icon: Package,
              },
              {
                title: "Depreciation Report",
                description: "Asset value changes over time",
                icon: TrendingUp,
              },
              {
                title: "Maintenance History",
                description: "All maintenance records and costs",
                icon: Wrench,
              },
              {
                title: "Assignment Report",
                description: "Current asset assignments by department",
                icon: FileText,
              },
              {
                title: "Disposal Report",
                description: "Disposed assets and recovery values",
                icon: BarChart3,
              },
              {
                title: "Financial Summary",
                description: "Asset values and cost analysis",
                icon: DollarSign,
              },
            ].map((report) => (
              <div
                key={report.title}
                className="flex items-start gap-4 rounded-lg border border-border/50 bg-background/50 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <report.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {report.description}
                  </p>
                  <Button variant="link" className="mt-2 h-auto p-0 text-sm">
                    Generate Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
