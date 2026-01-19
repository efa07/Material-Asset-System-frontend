'use client';

import { useMemo, useState } from 'react';
import { Activity, Search } from 'lucide-react';

import { PageHeader } from '@/components/dashboard/page-header';
import { DataTable, type Column } from '@/components/dashboard/data-table';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockAssets } from '@/lib/mock-data';
import type { Asset } from '@/types';

const columns: Column<Asset>[] = [
  {
    key: 'asset',
    header: 'Asset',
    cell: (a) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Activity className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">{a.name}</p>
          <p className="text-xs text-muted-foreground">{a.code}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (a) => <StatusBadge status={a.status} />,
    className: 'w-[140px]',
  },
  {
    key: 'store',
    header: 'Store',
    cell: (a) => <span className="text-sm text-muted-foreground">{a.storeId}</span>,
  },
  {
    key: 'updated',
    header: 'Last Updated',
    cell: (a) => <span className="text-xs text-muted-foreground">{new Date(a.updatedAt).toLocaleString()}</span>,
    className: 'w-[180px]',
  },
];

export default function AssetTrackingPage() {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return mockAssets;
    return mockAssets.filter((a) => a.name.toLowerCase().includes(s) || a.code.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="space-y-6">
      <PageHeader title="Status Tracking" description="Operational view of current asset states (mock dataset)" />

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by name or code…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <DataTable columns={columns} data={filtered} emptyMessage="No assets found." />
    </div>
  );
}

