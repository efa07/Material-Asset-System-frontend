'use client';

import { useMemo, useState } from 'react';
import { Download, ScrollText, Search } from 'lucide-react';

import { PageHeader } from '@/components/dashboard/page-header';
import { DataTable, type Column } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockAuditLogs } from '@/lib/mock-data';
import type { AuditLog } from '@/types';

const columns: Column<AuditLog>[] = [
  {
    key: 'action',
    header: 'Action',
    cell: (l) => <span className="font-medium text-xs">{l.action.replace(/_/g, ' ')}</span>,
  },
  {
    key: 'entity',
    header: 'Entity',
    cell: (l) => (
      <div>
        <p className="text-sm">{l.entityType}</p>
        <p className="text-xs text-muted-foreground">{l.entityId}</p>
      </div>
    ),
  },
  {
    key: 'details',
    header: 'Details',
    cell: (l) => <span className="text-sm text-muted-foreground line-clamp-1 max-w-[520px]">{l.details}</span>,
  },
  {
    key: 'ip',
    header: 'IP',
    cell: (l) => <span className="font-mono text-xs text-muted-foreground">{l.ipAddress ?? '—'}</span>,
    className: 'w-[160px]',
  },
  {
    key: 'time',
    header: 'Time',
    cell: (l) => <span className="text-xs text-muted-foreground">{new Date(l.timestamp).toLocaleString()}</span>,
    className: 'w-[180px]',
  },
];

export default function AuditorActivityLogsPage() {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return mockAuditLogs;
    return mockAuditLogs.filter((l) => l.action.toLowerCase().includes(s) || l.details.toLowerCase().includes(s) || l.entityType.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="space-y-6">
      <PageHeader title="User Activity Logs" description="Filterable, searchable, export-ready UI (read-only)">
        <Button variant="outline" className="bg-transparent">
          <Download className="mr-2 h-4 w-4" />
          Export (CSV/PDF)
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search logs…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ScrollText className="h-4 w-4" />
              {filtered.length} events
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable columns={columns} data={filtered} emptyMessage="No matching logs." />
    </div>
  );
}

