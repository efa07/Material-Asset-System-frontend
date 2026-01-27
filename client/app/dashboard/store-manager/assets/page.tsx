'use client';

import { useState } from 'react';
import { Search, Download, Eye, Package, Activity, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/dashboard/page-header';
import { DataTable, type Column } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { useAssets, useStores, useCategories } from '@/hooks/useQueries';
import type { Asset, AssetCategory, Store } from '@/types';

// Helper to create columns with access to lookups
const createColumns = (categories: AssetCategory[], stores: Store[]): Column<Asset>[] => [
	{
		key: 'code',
		header: 'Asset Code',
		cell: (asset) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Package className="h-4 w-4" />
        </div>
        <span className="font-mono text-xs font-medium">{asset.code}</span>
      </div>
    ),
	},
	{
		key: 'name',
		header: 'Name',
		cell: (asset) => (
			<div>
				<p className="font-medium text-sm">{asset.name}</p>
				<p className="text-xs text-muted-foreground">
					{categories.find((c) => c.id === asset.categoryId)?.name || asset.category?.name || 'Uncategorized'}
				</p>
			</div>
		),
	},
	{
		key: 'store',
		header: 'Store',
		cell: (asset) => {
      const storeName = stores.find((s) => s.id === asset.storeId)?.name || asset.store?.name || 'Unknown';
			return (
        <Badge variant="outline" className="font-normal">
          {storeName}
        </Badge>
			);
    },
	},
	{
		key: 'status',
		header: 'Status',
		cell: (asset) => <StatusBadge status={asset.status} />,
	},
	{
		key: 'value',
		header: 'Value',
		cell: (asset) => (
			<span className="text-sm font-medium font-mono">${(asset.currentValue || 0).toLocaleString()}</span>
		),
	},
	{
		key: 'updatedAt',
		header: 'Last Updated',
		cell: (asset) => (
			<span className="text-xs text-muted-foreground">
				{asset.updatedAt ? new Date(asset.updatedAt).toLocaleDateString() : '-'}
			</span>
		),
	},
	{
		key: 'actions',
		header: '',
		cell: () => (
			<Button variant="ghost" size="icon" className="h-8 w-8">
				<Eye className="h-4 w-4 text-muted-foreground" />
			</Button>
		),
		className: 'w-[50px]',
	},
];

export default function AssetOverviewPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [storeFilter, setStoreFilter] = useState('all');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

	const { data: assets = [], isLoading: assetsLoading } = useAssets();
	const { data: stores = [], isLoading: storesLoading } = useStores();
	const { data: categories = [], isLoading: categoriesLoading } = useCategories();

	const filteredAssets = assets.filter((asset) => {
		const matchesSearch =
			asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			asset.code?.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
		const matchesStore = storeFilter === 'all' || asset.storeId === storeFilter;
		return matchesSearch && matchesStatus && matchesStore;
	});

  // Pagination Logic
  const totalPages = Math.ceil(filteredAssets.length / pageSize);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset page when filters change
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

	const statusCounts = {
		total: assets.length,
		available: assets.filter((a) => a.status === 'AVAILABLE').length,
		inUse: assets.filter((a) => a.status === 'IN_USE').length,
		maintenance: assets.filter((a) => a.status === 'MAINTENANCE').length,
	};

	if (assetsLoading || storesLoading || categoriesLoading) {
		return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
             <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Card>
          <CardContent className="p-4">
             <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-[160px]" />
                <Skeleton className="h-10 w-[180px]" />
             </div>
          </CardContent>
        </Card>
        <div className="space-y-2">
           <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    );
	}

	const columns = createColumns(categories, stores);

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			<PageHeader
				title="Asset Overview"
				description="View and manage all assets across stores"
			>
				<Button variant="outline">
					<Download className="mr-2 h-4 w-4" />
					Export Report
				</Button>
			</PageHeader>

			{/* Quick Stats */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card className="hover:shadow-md transition-shadow">
					<CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
						  <div className="text-2xl font-bold">{statusCounts.total}</div>
						  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Assets</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Package className="h-6 w-6" />
            </div>
					</CardContent>
				</Card>
				<Card className="hover:shadow-md transition-shadow border-emerald-500/20 bg-emerald-500/5">
					<CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
						  <div className="text-2xl font-bold text-emerald-600">{statusCounts.available}</div>
						  <p className="text-xs text-emerald-600/80 font-medium uppercase tracking-wide">Available</p>
            </div>
            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
					</CardContent>
				</Card>
				<Card className="hover:shadow-md transition-shadow border-blue-500/20 bg-blue-500/5">
					<CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
						  <div className="text-2xl font-bold text-blue-600">{statusCounts.inUse}</div>
						  <p className="text-xs text-blue-600/80 font-medium uppercase tracking-wide">In Use</p>
            </div>
             <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Activity className="h-6 w-6" />
            </div>
					</CardContent>
				</Card>
				<Card className="hover:shadow-md transition-shadow border-amber-500/20 bg-amber-500/5">
					<CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
						  <div className="text-2xl font-bold text-amber-600">{statusCounts.maintenance}</div>
						  <p className="text-xs text-amber-600/80 font-medium uppercase tracking-wide">In Maintenance</p>
            </div>
             <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
              <AlertCircle className="h-6 w-6" />
            </div>
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
								className="pl-9 bg-muted/50 focus:bg-background transition-colors"
								value={searchQuery}
								onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset page on search
                }}
							/>
						</div>
						<Select value={statusFilter} onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}>
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
						<Select value={storeFilter} onValueChange={(val) => {
              setStoreFilter(val);
              setCurrentPage(1);
            }}>
							<SelectTrigger className="w-full md:w-[200px]">
								<SelectValue placeholder="Store" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Stores</SelectItem>
								{stores.map((store) => (
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
			<Card className="overflow-hidden border-border/60 shadow-sm">
				<CardHeader className="bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
					  <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <List className="h-5 w-5 text-primary" />
						  Asset Inventory
					  </CardTitle>
            <Badge variant="secondary" className="px-3 py-1 text-sm">
							{filteredAssets.length} items
						</Badge>
          </div>
          <CardDescription>
            List of all assets with their current status and value.
          </CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					<DataTable
						columns={columns}
						data={paginatedAssets}
						className="border-0 rounded-none shadow-none"
						emptyMessage="No assets found matching your criteria"
					/>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between p-4 border-t bg-muted/20">
             <div className="text-sm text-muted-foreground">
                Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to <strong>{Math.min(currentPage * pageSize, filteredAssets.length)}</strong> of <strong>{filteredAssets.length}</strong> results
             </div>
             <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Page</span>
                </Button>
                <div className="text-sm font-medium">
                   Page {currentPage} of {totalPages || 1}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-8 w-8 p-0"
                >
                   <ChevronRight className="h-4 w-4" />
                   <span className="sr-only">Next Page</span>
                </Button>
             </div>
          </div>
				</CardContent>
			</Card>
		</div>
	);
}
