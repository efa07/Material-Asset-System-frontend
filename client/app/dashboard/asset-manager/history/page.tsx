'use client';

import { useMemo, useState } from 'react';
import { History, Search, Package } from 'lucide-react';

import { PageHeader } from '@/components/dashboard/page-header';
import { Timeline } from '@/components/dashboard/timeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuditLogs, useAssets } from '@/hooks/useQueries';
import type { Asset, AuditLog } from '@/types';

export default function AssetHistoryPage() {
  const { data: auditLogs = [], isLoading } = useAuditLogs();
  const { data: assets = [] } = useAssets();
  const [q, setQ] = useState('');

  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    const filtered = (auditLogs || []).filter((log: AuditLog) => {
      const asset = assets.find((a: Asset) => a.id === log.entityId);
      const details = typeof log.details === 'string' ? log.details : JSON.stringify(log.details || {});
      return (
        log.entity.toLowerCase().includes('asset') &&
        (!s ||
          log.action.toLowerCase().includes(s) ||
          details.toLowerCase().includes(s) ||
          asset?.name.toLowerCase().includes(s))
      );
    });

    return filtered.slice(0, 25).map((log: AuditLog) => {
      const asset = assets.find((a: Asset) => a.id === log.entityId);
      const details = typeof log.details === 'string' ? log.details : JSON.stringify(log.details || {});
      return {
        id: log.id,
        title: `${asset?.name ?? 'Unknown Asset'} • ${log.action.replace(/_/g, ' ')}`,
        description: details,
        timestamp: log.timestamp,
        icon: <Package className="h-3 w-3" />,
        status: log.action.includes('DELETE') ? 'error' : log.action.includes('UPDATE') ? 'warning' : 'info',
      };
    });
  }, [q, auditLogs, assets]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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

