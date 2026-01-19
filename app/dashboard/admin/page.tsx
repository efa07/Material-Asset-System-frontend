'use client';

import { Package, Users, Building2, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { DataTable, type Column } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { mockDashboardStats, mockAssets, mockAuditLogs, assetsByStatusData, assetsTrendData } from '@/lib/mock-data';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import type { Asset, AuditLog } from '@/types';

const recentAssetsColumns: Column<Asset>[] = [
  {
    key: 'code',
    header: 'Asset Code',
    cell: (asset) => <span className="font-mono text-xs">{asset.code}</span>,
  },
  {
    key: 'name',
    header: 'Name',
    cell: (asset) => <span className="font-medium">{asset.name}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    cell: (asset) => <StatusBadge status={asset.status} />,
  },
  {
    key: 'updatedAt',
    header: 'Last Updated',
    cell: (asset) => (
      <span className="text-xs text-muted-foreground">
        {new Date(asset.updatedAt).toLocaleDateString()}
      </span>
    ),
  },
];

const auditLogsColumns: Column<AuditLog>[] = [
  {
    key: 'action',
    header: 'Action',
    cell: (log) => (
      <span className="font-medium text-xs">{log.action.replace(/_/g, ' ')}</span>
    ),
  },
  {
    key: 'entityType',
    header: 'Entity',
    cell: (log) => <span className="text-xs text-muted-foreground">{log.entityType}</span>,
  },
  {
    key: 'details',
    header: 'Details',
    cell: (log) => (
      <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
        {log.details}
      </span>
    ),
  },
  {
    key: 'timestamp',
    header: 'Time',
    cell: (log) => (
      <span className="text-xs text-muted-foreground">
        {new Date(log.timestamp).toLocaleString()}
      </span>
    ),
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="System overview and key performance indicators"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Assets"
          value={mockDashboardStats.totalAssets}
          icon={<Package className="h-5 w-5" />}
          trend={{ value: 8.2, label: 'from last month' }}
        />
        <StatsCard
          title="Assets In Use"
          value={mockDashboardStats.assetsInUse}
          icon={<CheckCircle2 className="h-5 w-5" />}
          trend={{ value: 12.5, label: 'utilization rate' }}
        />
        <StatsCard
          title="Pending Requests"
          value={mockDashboardStats.pendingRequests}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={{ value: -4.3, label: 'from yesterday' }}
        />
        <StatsCard
          title="Total Users"
          value={mockDashboardStats.totalUsers}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 2.1, label: 'this week' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Asset Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Asset Inventory Trend</CardTitle>
            <CardDescription>Monthly asset count over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetsTrendData}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="assets" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Asset Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Asset Distribution</CardTitle>
            <CardDescription>Assets by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] flex items-center gap-4">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={assetsByStatusData}
                      dataKey="value"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      strokeWidth={2}
                      stroke="hsl(var(--background))"
                    >
                      {assetsByStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {assetsByStatusData.map((item) => (
                  <div key={item.status} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs text-muted-foreground">{item.status}</span>
                    <span className="text-xs font-medium ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                <Building2 className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{mockDashboardStats.totalStores}</p>
                <p className="text-sm text-muted-foreground">Active Stores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                <Wrench className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{mockDashboardStats.maintenanceTasks}</p>
                <p className="text-sm text-muted-foreground">Maintenance Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                <CheckCircle2 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">98.5%</p>
                <p className="text-sm text-muted-foreground">System Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Recent Assets</CardTitle>
            <CardDescription>Latest asset updates in the system</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={recentAssetsColumns}
              data={mockAssets.slice(0, 5)}
              className="border-0 rounded-none"
            />
          </CardContent>
        </Card>

        {/* Recent Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
            <CardDescription>Latest system audit logs</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={auditLogsColumns}
              data={mockAuditLogs.slice(0, 5)}
              className="border-0 rounded-none"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
