'use client';

import { useState } from 'react';
import { RefreshCw, Wrench } from 'lucide-react';

import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { mockAssets, mockMaintenanceTasks } from '@/lib/mock-data';

export default function TechnicianUpdateStatusPage() {
  const [taskId, setTaskId] = useState(mockMaintenanceTasks[0]?.id ?? '');
  const [status, setStatus] = useState<'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED'>('IN_PROGRESS');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const task = mockMaintenanceTasks.find((t) => t.id === taskId);
  const asset = task ? mockAssets.find((a) => a.id === task.assetId) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader title="Update Status" description="Update maintenance task status (mock workflow)" />

      {saved && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
          <span className="font-medium text-emerald-500">Saved.</span> This will be persisted after backend integration.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">Task Update</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Task</Label>
              <Select value={taskId} onValueChange={setTaskId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task" />
                </SelectTrigger>
                <SelectContent>
                  {mockMaintenanceTasks.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.type} • {mockAssets.find((a) => a.id === t.assetId)?.code ?? t.assetId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Work performed, parts replaced, observations…" rows={5} />
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setSaved(true);
                  setTimeout(() => setSaved(false), 2500);
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Save Update
              </Button>
              <Button variant="outline" className="bg-transparent" onClick={() => setNotes('')}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border border-border/50 bg-background/50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Asset</span>
                <span className="font-medium">{asset?.code ?? '—'}</span>
              </div>
              <p className="mt-2 font-medium">{asset?.name ?? 'Select a task'}</p>
              <p className="text-xs text-muted-foreground">{asset?.serialNumber ?? ''}</p>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
              <span className="text-muted-foreground">Current</span>
              <StatusBadge status={task?.status ?? 'SCHEDULED'} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
              <span className="text-muted-foreground">Update to</span>
              <StatusBadge status={status} />
            </div>
            <div className="rounded-lg border border-border/50 bg-background/50 p-3">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Type</span>
                <span className="ml-auto font-medium">{task?.type ?? '—'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

