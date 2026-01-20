'use client';

import { useMemo, useState } from 'react';
import { FolderTree, Plus, Search } from 'lucide-react';

import { PageHeader } from '@/components/dashboard/page-header';
import { DataTable, type Column } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockCategories } from '@/lib/mock-data';
import type { AssetCategory } from '@/types';

const columns: Column<AssetCategory>[] = [
  {
    key: 'name',
    header: 'Category',
    cell: (c) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <FolderTree className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">{c.name}</p>
          <p className="text-xs text-muted-foreground">{c.id}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'description',
    header: 'Description',
    cell: (c) => <span className="text-sm text-muted-foreground">{c.description}</span>,
  },
  {
    key: 'createdAt',
    header: 'Created',
    cell: (c) => (
      <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
    ),
    className: 'w-[120px]',
  },
];

export default function AssetCategoriesPage() {
  const [categories, setCategories] = useState<AssetCategory[]>(mockCategories);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ name: '', description: '' });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [categories, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Categories"
        description="Manage asset classification used across stores, approvals, and audits"
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create category</DialogTitle>
              <DialogDescription>Categories improve reporting, control, and search accuracy.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  placeholder="e.g., Secure Electronics"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  value={draft.description}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                  placeholder="Short description for auditors and managers…"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const now = new Date().toISOString();
                  setCategories((prev) => [
                    { id: crypto.randomUUID(), name: draft.name.trim(), description: draft.description.trim(), createdAt: now },
                    ...prev,
                  ]);
                  setDraft({ name: '', description: '' });
                  setOpen(false);
                }}
                disabled={!draft.name.trim()}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories…" className="pl-9" />
          </div>
          <DataTable columns={columns} data={filtered} emptyMessage="No categories found." />
        </CardContent>
      </Card>
    </div>
  );
}

