'use client';

import { useMemo, useState } from 'react';
import { History, Search, Package } from 'lucide-react';

import { PageHeader } from '@/components/dashboard/page-header';
import { Timeline } from '@/components/dashboard/timeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockAssetHistory, mockAssets } from '@/lib/mock-data';

export default function AssetHistoryPage() {
  const [q, setQ] = useState('');

  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    const filtered = !s
      ? mockAssetHistory
      : mockAssetHistory.filter((h) => {
          const asset = mockAssets.find((a) => a.id === h.assetId);
          return (
            h.action.toLowerCase().includes(s) ||
            h.details.toLowerCase().includes(s) ||
            asset?.name.toLowerCase().includes(s) ||
            asset?.code.toLowerCase().includes(s)
          );
        });

    return filtered
      .slice(0, 25)
      .map((h) => {
        const asset = mockAssets.find((a) => a.id === h.assetId);
        return {
          id: h.id,
          title: `${asset?.name ?? 'Unknown Asset'} • ${h.action.replace(/_/g, ' ')}`,
          description: h.details,
          timestamp: h.timestamp,
          icon: <Package className="h-3 w-3" />,
          status:
            h.action.includes('REJECT') ? 'error' : h.action.includes('MAINTENANCE') ? 'warning' : 'info',
        };
      });
  }, [q]);

  return (
    <div className="space-y-6">
      <PageHeader title="Asset History" description="Lifecycle timeline across creation, assignment, maintenance, and disposal" />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <History className="h-4 w-4" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search events…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="rounded-xl border border-border/50 bg-background/40 p-4">
            <Timeline items={items} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

