'use client';

import { useMemo, useState } from 'react';
import { BarChart3, Save } from 'lucide-react';

import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function TechnicianPerformancePage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [tasksCompleted, setTasksCompleted] = useState('12');
  const [avgResolutionHours, setAvgResolutionHours] = useState('6.5');
  const [repeatIncidents, setRepeatIncidents] = useState('1');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const score = useMemo(() => {
    const t = Number(tasksCompleted || 0);
    const h = Number(avgResolutionHours || 0);
    const r = Number(repeatIncidents || 0);
    const base = Math.min(100, Math.round(t * 6 + 40));
    const penalty = Math.round(h * 2 + r * 8);
    return Math.max(0, base - penalty);
  }, [tasksCompleted, avgResolutionHours, repeatIncidents]);

  return (
    <div className="space-y-6">
      <PageHeader title="Performance Data" description="Enter operational metrics (mock entry screen)" />

      {saved && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
          <span className="font-medium text-emerald-500">Saved.</span> This will sync to backend later.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">Metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Reporting period</Label>
              <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                  <SelectItem value="quarter">This quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="tasks">Tasks completed</Label>
                <Input id="tasks" type="number" value={tasksCompleted} onChange={(e) => setTasksCompleted(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="avg">Avg. resolution (hours)</Label>
                <Input id="avg" type="number" value={avgResolutionHours} onChange={(e) => setAvgResolutionHours(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat">Repeat incidents</Label>
                <Input id="repeat" type="number" value={repeatIncidents} onChange={(e) => setRepeatIncidents(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} placeholder="Highlights, blockers, parts availability, etc." />
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setSaved(true);
                  setTimeout(() => setSaved(false), 2500);
                }}
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" className="bg-transparent" onClick={() => setNotes('')}>
                Clear notes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <BarChart3 className="h-4 w-4" />
              Score Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border/50 bg-background/50 p-4">
              <p className="text-3xl font-semibold tracking-tight">{score}</p>
              <p className="text-sm text-muted-foreground">Composite score (mock)</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/50 p-4 text-sm">
              <p className="font-medium">How it’s used</p>
              <p className="mt-1 text-muted-foreground">
                This UI is export-ready and will later feed compliance reports and capacity planning.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

