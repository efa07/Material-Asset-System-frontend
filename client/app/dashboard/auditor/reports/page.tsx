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
  FileText,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle,
  Package,
} from "lucide-react";
import { useState } from "react";

export default function AuditorReportsPage() {
  const { auditRecords, assets, disposalRecords, stores } = useAppStore();
  const [reportPeriod, setReportPeriod] = useState("quarter");

  const completedAudits = auditRecords.filter((a) => a.status === "COMPLETED");
  const totalDiscrepancies = auditRecords.reduce(
    (sum, a) => sum + (a.discrepanciesFound || 0),
    0
  );
  const totalAssetsAudited = auditRecords.reduce(
    (sum, a) => sum + (a.assetsAudited || 0),
    0
  );

  const auditsByType = auditRecords.reduce(
    (acc, audit) => {
      acc[audit.type] = (acc[audit.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const complianceRate =
    totalAssetsAudited > 0
      ? Math.round(
          ((totalAssetsAudited - totalDiscrepancies) / totalAssetsAudited) * 100
        )
      : 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Reports"
        description="Generate and analyze audit reports"
        action={
          <div className="flex items-center gap-2">
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-40">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Audits</p>
                <p className="text-2xl font-bold">{auditRecords.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <ClipboardCheck className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assets Audited</p>
                <p className="text-2xl font-bold">{totalAssetsAudited}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Package className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold text-emerald-500">
                  {complianceRate}%
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Discrepancies</p>
                <p className="text-2xl font-bold text-red-500">
                  {totalDiscrepancies}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-500" />
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
              Audits by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(auditsByType).map(([type, count]) => {
                const percentage =
                  Math.round((count / auditRecords.length) * 100) || 0;
                const colors: Record<string, string> = {
                  PERIODIC: "bg-blue-500",
                  RANDOM: "bg-amber-500",
                  COMPLIANCE: "bg-emerald-500",
                  SPECIAL: "bg-purple-500",
                };
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{type.toLowerCase()}</span>
                      <span className="font-medium">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${colors[type] || "bg-primary"}`}
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
              Audits by Store
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stores.map((store) => {
                const storeAudits = auditRecords.filter(
                  (a) => a.storeId === store.id
                ).length;
                const percentage =
                  auditRecords.length > 0
                    ? Math.round((storeAudits / auditRecords.length) * 100)
                    : 0;
                return (
                  <div key={store.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{store.name}</span>
                      <span className="font-medium">
                        {storeAudits} ({percentage}%)
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
                title: "Audit Summary Report",
                description: "Overview of all audits and findings",
                icon: ClipboardCheck,
              },
              {
                title: "Compliance Report",
                description: "Compliance status across all stores",
                icon: CheckCircle,
              },
              {
                title: "Discrepancy Report",
                description: "Detailed list of all discrepancies found",
                icon: AlertTriangle,
              },
              {
                title: "Asset Verification Report",
                description: "Asset existence and condition verification",
                icon: Package,
              },
              {
                title: "Trend Analysis",
                description: "Audit trends and patterns over time",
                icon: TrendingUp,
              },
              {
                title: "Store Performance Report",
                description: "Audit results by store location",
                icon: BarChart3,
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
