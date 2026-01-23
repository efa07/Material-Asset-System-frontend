'use client';

import { useMemo, useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCategories, useStores } from '@/hooks/useQueries';
import { useCreateAsset } from '@/hooks/useMutations';

export default function AssetRegisterPage() {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const { data: stores = [] } = useStores();
  const { mutate: createAsset, isPending } = useCreateAsset();

  const [categoryId, setCategoryId] = useState<string>('');
  const [storeId, setStoreId] = useState<string>('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Set default category/store when loaded if not set (optional, good UX)
  useMemo(() => {
    if (!categoryId && categories.length > 0) setCategoryId(categories[0].id);
  }, [categories, categoryId]);

  useMemo(() => {
    if (!storeId && stores.length > 0) setStoreId(stores[0].id);
  }, [stores, storeId]);

  const canSubmit = useMemo(() => {
    return name.trim().length > 2 && code.trim().length > 2 && categoryId && storeId;
  }, [name, code, categoryId, storeId]);

  const handleSubmit = () => {
    createAsset({
        name,
        barcode: code, // Map code to barcode
        categoryId,
        storeId,
        serialNumber,
        purchaseDate,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
        description,
        status: 'AVAILABLE'
    }, {
        onSuccess: () => {
             setSubmitted(true);
             setTimeout(() => {
                 setSubmitted(false);
                 router.push('/dashboard/asset-manager/assets');
             }, 1500);
        }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Register Asset"
        description="Create an asset record"
      >
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || isPending}
        >
          <PackagePlus className="mr-2 h-4 w-4" />
          {isPending ? 'Registering...' : 'Register'}
        </Button>
      </PageHeader>

      {submitted && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
          <span className="font-medium text-emerald-500">Asset registered successfully.</span>{' '}
          Redirecting...
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">Asset Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Dell Latitude 5540" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="code">Asset Code</Label>
                <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g., AST-019" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="serial">Serial Number</Label>
                <Input id="serial" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="Optional" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Store</Label>
                <Select value={storeId} onValueChange={setStoreId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input id="purchaseDate" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Input id="purchasePrice" type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Optional notes for auditors / asset lifecycle..." />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border border-border/50 bg-background/50 p-3">
              <p className="font-medium">{name.trim() || '—'}</p>
              <p className="text-xs text-muted-foreground">{code.trim() || 'No code yet'}</p>
            </div>
            <div className="grid gap-2 rounded-lg border border-border/50 bg-background/50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{categories.find((c) => c.id === categoryId)?.name ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Store</span>
                <span className="font-medium">{stores.find((s) => s.id === storeId)?.name ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Serial</span>
                <span className="font-medium">{serialNumber.trim() || '—'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

