"use client";

import { useAppStore } from "@/store/useAppStore";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ClipboardCheck,
  FileSearch,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Package,
  Clock,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function AuditorDashboard() {
  const { auditRecords, assets, disposalRecords, maintenanceRecords, currentUser } =
    useAppStore();

  const pendingAudits = auditRecords.filter((a) => a.status === "IN_PROGRESS");
  const completedAudits = auditRecords.filter((a) => a.status === "COMPLETED");
  const scheduledAudits = auditRecords.filter((a) => a.status === "SCHEDULED");

  const totalDiscrepancies = auditRecords.reduce(
    (sum, a) => sum + (a.discrepanciesFound || 0),
    0
  );

  const recentAudits = auditRecords.slice(0, 5);
  const pendingDisposals = disposalRecords.filter((d) => d.status === "PENDING");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Auditor Dashboard"
        description={`Welcome back, ${currentUser?.name || "Auditor"}`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Scheduled Audits"
          value={scheduledAudits.length}
          icon={Clock}
          description="Upcoming"
        />
        <StatsCard
          title="In Progress"
          value={pendingAudits.length}
          icon={FileSearch}
          description="Active audits"
        />
        <StatsCard
          title="Completed"
          value={completedAudits.length}
          icon={CheckCircle}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Discrepancies"
          value={totalDiscrepancies}
          icon={AlertTriangle}
          description="Found issues"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Recent Audits
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/auditor/audits">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAudits.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <ClipboardCheck className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No audit records found</p>
                </div>
              ) : (
                recentAudits.map((audit) => (
                  <div
                    key={audit.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4"
                  >
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
                      <div>
                        <p className="font-medium capitalize">
                          {audit.type.toLowerCase().replace("_", " ")} Audit
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(audit.auditDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {audit.discrepanciesFound && audit.discrepanciesFound > 0 && (
                        <span className="rounded bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">
                          {audit.discrepanciesFound} issues
                        </span>
                      )}
                      <StatusBadge status={audit.status} />
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
              Pending Reviews
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/auditor/disposals">
                View All
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDisposals.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <FileSearch className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No pending reviews</p>
                </div>
              ) : (
                pendingDisposals.slice(0, 5).map((disposal) => {
                  const asset = assets.find((a) => a.id === disposal.assetId);
                  return (
                    <div
                      key={disposal.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                          <Package className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {asset?.name || "Unknown Asset"}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {disposal.method.toLowerCase()} - $
                            {disposal.estimatedValue?.toLocaleString() || "0"}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={disposal.status} />
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Audit Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Assets Audited
                </span>
                <span className="font-semibold">
                  {auditRecords.reduce(
                    (sum, a) => sum + (a.assetsAudited || 0),
                    0
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Compliance Rate
                </span>
                <span className="font-semibold text-emerald-500">94.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Avg. Audit Duration
                </span>
                <span className="font-semibold">3.2 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Resolution Rate
                </span>
                <span className="font-semibold text-blue-500">87%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col py-4 bg-transparent" asChild>
                <Link href="/dashboard/auditor/audits/new">
                  <ClipboardCheck className="mb-2 h-6 w-6" />
                  <span>Start Audit</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4 bg-transparent" asChild>
                <Link href="/dashboard/auditor/assets">
                  <FileSearch className="mb-2 h-6 w-6" />
                  <span>Asset Review</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4 bg-transparent" asChild>
                <Link href="/dashboard/auditor/reports">
                  <BarChart3 className="mb-2 h-6 w-6" />
                  <span>Reports</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4 bg-transparent" asChild>
                <Link href="/dashboard/auditor/compliance">
                  <TrendingUp className="mb-2 h-6 w-6" />
                  <span>Compliance</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
