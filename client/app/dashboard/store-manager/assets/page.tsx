'use client';

import { useState } from 'react';
import { Search, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/dashboard/page-header';
import { DataTable, type Column } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { mockAssets, mockStores, mockCategories } from '@/lib/mock-data';
import type { Asset } from '@/types';

const columns: Column<Asset>[] = [
  {
    key: 'code',
    header: 'Asset Code',
    cell: (asset) => <span className="font-mono text-xs font-medium">{asset.code}</span>,
  },
  {
    key: 'name',
    header: 'Name',
    cell: (asset) => (
      <div>
        <p className="font-medium text-sm">{asset.name}</p>
        <p className="text-xs text-muted-foreground">
          {mockCategories.find((c) => c.id === asset.categoryId)?.name || 'Uncategorized'}
        </p>
      </div>
    ),
  },
  {
    key: 'store',
    header: 'Store',
    cell: (asset) => (
      <span className="text-sm">
        {mockStores.find((s) => s.id === asset.storeId)?.name || 'Unknown'}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (asset) => <StatusBadge status={asset.status} />,
  },
  {
    key: 'value',
    header: 'Current Value',
    cell: (asset) => (
      <span className="text-sm font-medium">${asset.currentValue.toLocaleString()}</span>
    ),
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
  {
    key: 'actions',
    header: '',
    cell: () => (
      <Button variant="ghost" size="sm" className="h-8">
        <Eye className="h-4 w-4" />
      </Button>
    ),
    className: 'w-[50px]',
  },
];

export default function AssetOverviewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');

  const filteredAssets = mockAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    const matchesStore = storeFilter === 'all' || asset.storeId === storeFilter;
    return matchesSearch && matchesStatus && matchesStore;
  });

  const statusCounts = {
    total: mockAssets.length,
    available: mockAssets.filter((a) => a.status === 'AVAILABLE').length,
    inUse: mockAssets.filter((a) => a.status === 'IN_USE').length,
    maintenance: mockAssets.filter((a) => a.status === 'MAINTENANCE').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Overview"
        description="View and manage all assets across stores"
      >
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </PageHeader>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-semibold">{statusCounts.total}</div>
              <p className="text-xs text-muted-foreground">Total Assets</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-4">
              <div className="text-2xl font-semibold text-emerald-500">{statusCounts.available}</div>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-4">
              <div className="text-2xl font-semibold text-blue-500">{statusCounts.inUse}</div>
              <p className="text-xs text-muted-foreground">In Use</p>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="text-2xl font-semibold text-amber-500">{statusCounts.maintenance}</div>
              <p className="text-xs text-muted-foreground">In Maintenance</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search assets by name or code..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="IN_USE">In Use</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="DISPOSED">Disposed</SelectItem>
                  <SelectItem value="RESERVED">Reserved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={storeFilter} onValueChange={setStoreFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {mockStores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Assets Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Assets
              <Badge variant="secondary" className="ml-2">
                {filteredAssets.length} items
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={filteredAssets}
              className="border-0 rounded-none"
              emptyMessage="No assets found matching your criteria"
            />
          </CardContent>
        </Card>
    </div>
  );
}
