'use client';

import { useMemo, useState } from 'react';
import { GitBranch, Search } from 'lucide-react';

import { PageHeader } from '@/components/dashboard/page-header';
import { Timeline } from '@/components/dashboard/timeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockAssetHistory, mockAssets } from '@/lib/mock-data';

export default function AuditorLifecyclePage() {
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

    return filtered.map((h) => {
      const asset = mockAssets.find((a) => a.id === h.assetId);
      return {
        id: h.id,
        title: `${asset?.code ?? h.assetId} • ${h.action.replace(/_/g, ' ')}`,
        description: h.details,
        timestamp: h.timestamp,
        icon: <GitBranch className="h-3 w-3" />,
        status: h.action.includes('REJECT') ? 'error' : h.action.includes('MAINTENANCE') ? 'warning' : 'info',
      };
    });
  }, [q]);

  return (
    <div className="space-y-6">
      <PageHeader title="Asset Lifecycle History" description="Read-only lifecycle stream (auditor view)" />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search asset or action…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="rounded-xl border border-border/50 bg-background/40 p-4">
            <Timeline items={items} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

