'use client';

import { Archive, Package, ClipboardCheck, ArrowLeftRight, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Progress } from '@/components/ui/progress';
import { mockStores, mockShelves, mockAssets, mockAssignmentRequests, mockTransferRequests, storeOccupancyData } from '@/lib/mock-data';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function StoreManagerDashboard() {
  const pendingAssignments = mockAssignmentRequests.filter((r) => r.status === 'PENDING').length;
  const pendingTransfers = mockTransferRequests.filter((r) => r.status === 'PENDING').length;
  const totalAssets = mockAssets.length;
  const totalShelves = mockShelves.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Store Dashboard"
        description="Overview of store operations and pending approvals"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Shelves"
          value={totalShelves}
          icon={<Archive className="h-5 w-5" />}
          description="Across all stores"
        />
        <StatsCard
          title="Assets Managed"
          value={totalAssets}
          icon={<Package className="h-5 w-5" />}
          trend={{ value: 5.2, label: 'this month' }}
        />
        <StatsCard
          title="Pending Assignments"
          value={pendingAssignments}
          icon={<ClipboardCheck className="h-5 w-5" />}
          description="Awaiting approval"
        />
        <StatsCard
          title="Pending Transfers"
          value={pendingTransfers}
          icon={<ArrowLeftRight className="h-5 w-5" />}
          description="Awaiting approval"
        />
      </div>

      {/* Store Occupancy */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Store Occupancy</CardTitle>
            <CardDescription>Current capacity utilization by store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={storeOccupancyData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    width={120}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Occupancy']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="occupancy" radius={[0, 4, 4, 0]}>
                    {storeOccupancyData.map((entry, index) => (
                      <rect
                        key={`bar-${index}`}
                        fill={entry.occupancy > 90 ? 'hsl(var(--destructive))' : entry.occupancy > 70 ? 'hsl(var(--warning))' : 'hsl(var(--chart-1))'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Store Capacity Details</CardTitle>
            <CardDescription>Detailed breakdown by store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockStores.map((store) => {
              const occupancy = Math.round((store.currentOccupancy / store.capacity) * 100);
              return (
                <div key={store.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{store.name}</span>
                    <span className="text-muted-foreground">
                      {store.currentOccupancy} / {store.capacity}
                    </span>
                  </div>
                  <Progress 
                    value={occupancy} 
                    className="h-2"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Pending Assignment Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">Pending Assignment Requests</CardTitle>
                <CardDescription>Requests awaiting your approval</CardDescription>
              </div>
              {pendingAssignments > 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20">
                  <span className="text-xs font-semibold text-amber-500">{pendingAssignments}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {mockAssignmentRequests.filter((r) => r.status === 'PENDING').length > 0 ? (
              <div className="space-y-3">
                {mockAssignmentRequests
                  .filter((r) => r.status === 'PENDING')
                  .map((request) => {
                    const asset = mockAssets.find((a) => a.id === request.assetId);
                    return (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{asset?.name || 'Unknown Asset'}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {request.reason}
                          </p>
                        </div>
                        <StatusBadge status={request.status} />
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ClipboardCheck className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No pending assignment requests</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Transfer Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">Pending Transfer Requests</CardTitle>
                <CardDescription>Transfer requests awaiting approval</CardDescription>
              </div>
              {pendingTransfers > 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20">
                  <span className="text-xs font-semibold text-amber-500">{pendingTransfers}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {mockTransferRequests.filter((r) => r.status === 'PENDING').length > 0 ? (
              <div className="space-y-3">
                {mockTransferRequests
                  .filter((r) => r.status === 'PENDING')
                  .map((request) => {
                    const asset = mockAssets.find((a) => a.id === request.assetId);
                    const fromStore = mockStores.find((s) => s.id === request.fromStoreId);
                    const toStore = mockStores.find((s) => s.id === request.toStoreId);
                    return (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{asset?.name || 'Unknown Asset'}</p>
                          <p className="text-xs text-muted-foreground">
                            {fromStore?.name} → {toStore?.name}
                          </p>
                        </div>
                        <StatusBadge status={request.status} />
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ArrowLeftRight className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No pending transfer requests</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="font-medium text-foreground">Capacity Alert</p>
              <p className="text-sm text-muted-foreground">
                Main Warehouse is at 75.6% capacity. Consider optimizing storage or requesting additional space.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
