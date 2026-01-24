'use client';

import { Archive, Package, ClipboardCheck, ArrowLeftRight, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Progress } from '@/components/ui/progress';
import { AreaChartGradient } from '@/components/dashboard/area-chart-gradient';
import { useStores, useAssets, useAssignmentRequests, useTransferRequests, useDashboardCharts } from '@/hooks/useQueries';

export default function StoreManagerDashboard() {
  const { data: stores, isLoading: storesLoading } = useStores();
  const { data: assets, isLoading: assetsLoading } = useAssets();
  const { data: assignmentRequests, isLoading: assignmentsLoading } = useAssignmentRequests();
  const { data: transferRequests, isLoading: transfersLoading } = useTransferRequests();
  const { data: charts, isLoading: chartsLoading } = useDashboardCharts();

  if (storesLoading || assetsLoading || assignmentsLoading || transfersLoading || chartsLoading) {
    return <div>Loading...</div>;
  }

  const pendingAssignments = (assignmentRequests || []).filter((r) => r.status === 'PENDING').length;
  const pendingTransfers = (transferRequests || []).filter((r) => r.status === 'PENDING').length;
  const totalAssets = assets?.length || 0;
  const totalShelves = stores?.reduce((acc, store) => acc + (store.shelves?.length || 0), 0) || 0;

  const throughputTrend = charts?.assetsTrend || [];

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

      {/* Store Throughput & Capacity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Store Throughput</CardTitle>
            <CardDescription>Items processed across all stores (monthly)</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChartGradient data={throughputTrend} xKey="month" yKey="throughput" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Store Asset Distribution</CardTitle>
            <CardDescription>Number of assets per store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(stores || []).map((store) => {
               const assetsInStore = assets?.filter(a => a.storeId === store.id).length || 0;
               const percentage = totalAssets > 0 ? Math.round((assetsInStore / totalAssets) * 100) : 0;
              return (
                <div key={store.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{store.name}</span>
                    <span className="text-muted-foreground">
                      {assetsInStore} Assets
                    </span>
                  </div>
                  <Progress
                    value={percentage}
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
            {(assignmentRequests || []).filter((r) => r.status === 'PENDING').length > 0 ? (
              <div className="space-y-3">
                {(assignmentRequests || [])
                  .filter((r) => r.status === 'PENDING')
                  .map((request) => {
                    const asset = (assets || []).find((a) => a.id === request.assetId);
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
            {(transferRequests || []).filter((r) => r.status === 'PENDING').length > 0 ? (
              <div className="space-y-3">
                {(transferRequests || [])
                  .filter((r) => r.status === 'PENDING')
                  .map((request) => {
                    const asset = (assets || []).find((a) => a.id === request.assetId);
                    const fromStore = (stores || []).find((s) => s.id === request.fromStoreId);
                    const toStore = (stores || []).find((s) => s.id === request.toStoreId);
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
