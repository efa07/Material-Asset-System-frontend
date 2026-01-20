'use client';

import { Package, Users, AlertTriangle, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { DataTable, type Column } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { AreaChartGradient } from '@/components/dashboard/area-chart-gradient';
import { Progress } from '@/components/ui/progress';
import { mockDashboardStats, mockAuditLogs, assetsTrendData } from '@/lib/mock-data';
import type { AuditLog } from '@/types';



import { cn } from '@/lib/utils';

const auditLogsColumns: Column<AuditLog>[] = [
  {
    key: 'timestamp',
    header: 'Timestamp',
    cell: (log) => (
      <span className="text-xs text-muted-foreground font-mono">
        {log.timestamp.replace('T', ' ').replace('Z', '')}
      </span>
    ),
  },
  {
    key: 'userName',
    header: 'User',
    cell: (log) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 text-[10px] font-bold text-foreground/70">
          {log.userId}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-foreground">{log.userName}</span>
          <span className="text-[10px] text-muted-foreground">{log.userRole}</span>
        </div>
      </div>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    cell: (log) => (
      <span className="text-xs font-medium">{log.action}</span>
    ),
  },
  {
    key: 'target',
    header: 'Target',
    cell: (log) => <span className="text-xs font-mono text-muted-foreground/80">{log.target}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    cell: (log) => (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
          log.status === 'Success' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          log.status === 'Warning' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
          log.status === 'Error' && "bg-rose-500/10 text-rose-500 border-rose-500/20"
        )}
      >
        {log.status}
      </span>
    ),
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Assets"
          value="14,203"
          icon={<Package className="h-6 w-6" />}
          trend={{ value: 5, label: 'from last month' }}
          accentColor="var(--chart-1)"
        />
        <StatsCard
          title="Active Users"
          value="89"
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 0, label: 'stable' }}
          accentColor="var(--success)"
        />
        <StatsCard
          title="System Health"
          value="99.9%"
          icon={<Activity className="h-6 w-6" />}
          trend={{ value: 0.1, label: 'uptime' }}
          accentColor="var(--success)"
        />
        <StatsCard
          title="Security Alerts"
          value="3"
          icon={<AlertTriangle className="h-6 w-6" />}
          trend={{ value: 2, label: 'requires attention' }}
          accentColor="var(--warning)"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* System Traffic Chart */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-medium">System Traffic & Asset Requests</CardTitle>
              <CardDescription>Overview of system load over the last 7 days</CardDescription>
            </div>
            <div className="flex bg-secondary/50 rounded-lg p-1">
              <div className="px-3 py-1 bg-background rounded-md text-xs font-medium shadow-sm">Week</div>
              <div className="px-3 py-1 text-muted-foreground text-xs font-medium">Month</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-3xl font-bold">2,403</span>
              <span className="text-sm font-medium text-muted-foreground mr-2">Requests</span>
              <span className="text-sm font-medium text-emerald-500">+12% vs last week</span>
            </div>
            <AreaChartGradient
              data={assetsTrendData}
              xKey="month"
              yKey="assets"
              stroke="var(--chart-1)"
              height={300}
            />
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">Server Load</span>
                <span className="font-bold">45%</span>
              </div>
              <Progress value={45} className="h-2" indicatorClassName="bg-blue-500" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">Database Storage</span>
                <span className="font-bold">72%</span>
              </div>
              <Progress value={72} className="h-2" indicatorClassName="bg-violet-500" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">Memory Usage</span>
                <span className="font-bold">28%</span>
              </div>
              <Progress value={28} className="h-2" indicatorClassName="bg-emerald-500" />
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-500">Maintenance Scheduled</p>
                  <p className="text-xs text-muted-foreground">
                    System maintenance is scheduled for Sunday at 02:00 AM UTC. Expected downtime: 30 mins.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Audit Logs */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-medium">Recent Audit Logs</CardTitle>
            <CardDescription>Latest administrative actions tracked by the system.</CardDescription>
          </div>
          <div className="text-sm font-medium text-primary cursor-pointer hover:underline">
            View All &rarr;
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={auditLogsColumns}
            data={mockAuditLogs}
            className="border-0 rounded-none"
          />
        </CardContent>
      </Card>
    </div>
  );
}
