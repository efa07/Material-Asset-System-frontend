'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useCreateStore, useCreateShelf } from '@/hooks/useMutations';
import { toast } from 'sonner';

interface ShelfInput {
  name: string;
  description: string;
}

export default function RegisterStorePage() {
  const router = useRouter();
  const createStoreMutation = useCreateStore();
  const createShelfMutation = useCreateShelf();

  const [storeData, setStoreData] = useState({
    name: '',
    location: '',
    description: '',
  });

  const [shelves, setShelves] = useState<ShelfInput[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddShelf = () => {
    setShelves((prev) => [...prev, { name: '', description: '' }]);
  };

  const handleShelfChange = (index: number, field: keyof ShelfInput, value: string) => {
    setShelves((prev) => {
      const newShelves = [...prev];
      newShelves[index][field] = value;
      return newShelves;
    });
  };

  const handleRemoveShelf = (index: number) => {
    setShelves((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeData.name) {
      toast.error('Store name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create Store
      const storeResponse = await createStoreMutation.mutateAsync({
        name: storeData.name,
        location: storeData.location,
        description: storeData.description,
      });

      const storeId = storeResponse.id;

      // 2. Create Shelves if any
      if (shelves.length > 0 && storeId) {
        await Promise.all(
          shelves.map((shelf) =>
            createShelfMutation.mutateAsync({
              name: shelf.name,
              description: shelf.description,
              storeId: storeId,
            })
          )
        );
      }

      toast.success('Store and shelves registered successfully');
      router.push('/dashboard/store-manager');
    } catch (error) {
      console.error('Failed to register store', error);
      // Toast error is handled in useMutations
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Register Store"
        description="Create a new store and configure its shelves."
      />
      <div>
         <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Store Details */}
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle>Store Details</CardTitle>
              <CardDescription>Enter the general information for the new store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Main Warehouse"
                  value={storeData.name}
                  onChange={handleStoreChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. Building A, Ground Floor"
                  value={storeData.location}
                  onChange={handleStoreChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Optional description of the store..."
                  value={storeData.description}
                  onChange={handleStoreChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Shelves */}
          <Card className="md:col-span-1 h-fit">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Shelves</CardTitle>
                <CardDescription>Add shelves to this store.</CardDescription>
              </div>
              <Button type="button" size="sm" onClick={handleAddShelf} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Shelf
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {shelves.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                  No shelves added yet. Click &quot;Add Shelf&quot; to start.
                </div>
              ) : (
                <div className="space-y-4">
                  {shelves.map((shelf, index) => (
                    <div key={index} className="flex gap-3 items-start p-3 border rounded-md">
                      <div className="grid gap-3 flex-1">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor={`shelf-name-${index}`} className="text-xs">Name *</Label>
                                <Input
                                    id={`shelf-name-${index}`}
                                    placeholder="e.g. A-1"
                                    value={shelf.name}
                                    onChange={(e) => handleShelfChange(index, 'name', e.target.value)}
                                    required
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`shelf-desc-${index}`} className="text-xs">Description</Label>
                                <Input
                                    id={`shelf-desc-${index}`}
                                    placeholder="Optional"
                                    value={shelf.description}
                                    onChange={(e) => handleShelfChange(index, 'description', e.target.value)}
                                    className="h-8"
                                />
                            </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6 h-8 w-8"
                        onClick={() => handleRemoveShelf(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
           <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
                 <>Saving...</>
            ) : (
                <>
                    <Save className="mr-2 h-4 w-4" />
                    Register Store & Shelves
                </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
