'use client';

import { useState } from 'react';
import { Search, Download, Filter, Calendar, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/dashboard/page-header';
import { DataTable, type Column } from '@/components/dashboard/data-table';
import { mockAuditLogs } from '@/lib/mock-data';
import { mockUsers } from '@/store/useAppStore';
import type { AuditLog } from '@/types';

const actionColors: Record<string, string> = {
  USER_LOGIN: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  ASSET_CREATED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  REQUEST_APPROVED: 'bg-green-500/10 text-green-500 border-green-500/20',
  REQUEST_REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
  MAINTENANCE_STARTED: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  ASSET_UPDATED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  USER_CREATED: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
};

const extendedLogs: AuditLog[] = [
  ...mockAuditLogs,
  {
    id: '6',
    userId: '1',
    action: 'ASSET_UPDATED',
    entityType: 'Asset',
    entityId: '5',
    details: 'Updated server configuration settings',
    ipAddress: '192.168.1.100',
    timestamp: '2025-01-10T14:20:00Z',
  },
  {
    id: '7',
    userId: '3',
    action: 'USER_LOGIN',
    entityType: 'User',
    entityId: '3',
    details: 'Asset Manager logged in via SSO',
    ipAddress: '192.168.1.105',
    timestamp: '2025-01-10T08:00:00Z',
  },
  {
    id: '8',
    userId: '2',
    action: 'REQUEST_APPROVED',
    entityType: 'TransferRequest',
    entityId: '2',
    details: 'Transfer request approved for Executive Desk',
    ipAddress: '192.168.1.102',
    timestamp: '2025-01-09T15:30:00Z',
  },
];

const columns: Column<AuditLog>[] = [
  {
    key: 'timestamp',
    header: 'Timestamp',
    cell: (log) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs">{new Date(log.timestamp).toLocaleString()}</span>
      </div>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    cell: (log) => (
      <Badge
        variant="outline"
        className={`font-medium text-[10px] uppercase tracking-wide ${actionColors[log.action] || 'bg-muted text-muted-foreground'}`}
      >
        {log.action.replace(/_/g, ' ')}
      </Badge>
    ),
  },
  {
    key: 'user',
    header: 'User',
    cell: (log) => {
      const user = Object.values(mockUsers).find((u) => u.id === log.userId);
      return (
        <span className="text-sm font-medium">{user?.name || 'Unknown'}</span>
      );
    },
  },
  {
    key: 'entityType',
    header: 'Entity',
    cell: (log) => (
      <div className="text-xs">
        <span className="text-muted-foreground">{log.entityType}</span>
        <span className="text-muted-foreground/60"> #{log.entityId}</span>
      </div>
    ),
  },
  {
    key: 'details',
    header: 'Details',
    cell: (log) => (
      <span className="text-xs text-muted-foreground max-w-[250px] truncate block">
        {log.details}
      </span>
    ),
  },
  {
    key: 'ipAddress',
    header: 'IP Address',
    cell: (log) => (
      <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
        <Globe className="h-3 w-3" />
        {log.ipAddress || 'N/A'}
      </div>
    ),
  },
];

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = extendedLogs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const uniqueActions = [...new Set(extendedLogs.map((log) => log.action))];

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Audit Logs"
        description="Track all system activities and user actions"
      >
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </PageHeader>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-semibold">{extendedLogs.length}</div>
              <p className="text-xs text-muted-foreground">Total Log Entries</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-semibold">
                {extendedLogs.filter((l) => l.action === 'USER_LOGIN').length}
              </div>
              <p className="text-xs text-muted-foreground">Login Events</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-semibold">
                {extendedLogs.filter((l) => l.action.includes('ASSET')).length}
              </div>
              <p className="text-xs text-muted-foreground">Asset Operations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-semibold">
                {extendedLogs.filter((l) => l.action.includes('REQUEST')).length}
              </div>
              <p className="text-xs text-muted-foreground">Request Actions</p>
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
                  placeholder="Search logs..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="date" className="w-full md:w-auto" />
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Audit Log Entries
              <Badge variant="secondary" className="ml-2">
                {filteredLogs.length} records
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={filteredLogs}
              className="border-0 rounded-none"
              emptyMessage="No audit logs found matching your criteria"
            />
          </CardContent>
        </Card>
    </div>
  );
}
