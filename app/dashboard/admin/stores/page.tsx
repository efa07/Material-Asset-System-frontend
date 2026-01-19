'use client';

import { useState } from 'react';
import { Plus, Search, MapPin, Package, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/dashboard/page-header';
import { mockStores, mockShelves } from '@/lib/mock-data';
import { mockUsers } from '@/store/useAppStore';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Loading from './loading';

export default function StoresPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();

  const filteredStores = mockStores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        <PageHeader
          title="Store Registration"
          description="Manage storage facilities and their capacities"
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Store
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New Store</DialogTitle>
                <DialogDescription>
                  Add a new storage facility to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input id="store-name" placeholder="Enter store name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Building, Floor, etc." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacity (units)</Label>
                  <Input id="capacity" type="number" placeholder="Enter capacity" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Register Store</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeader>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search stores by name or location..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stores Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredStores.map((store) => {
            const occupancyPercentage = Math.round((store.currentOccupancy / store.capacity) * 100);
            const storeShelves = mockShelves.filter((s) => s.storeId === store.id);
            const manager = Object.values(mockUsers).find((u) => u.id === store.managerId);

            let occupancyColor = 'bg-emerald-500';
            if (occupancyPercentage > 90) occupancyColor = 'bg-red-500';
            else if (occupancyPercentage > 70) occupancyColor = 'bg-amber-500';

            return (
              <Card key={store.id} className="transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium">{store.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {store.location}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Store</DropdownMenuItem>
                        <DropdownMenuItem>Manage Shelves</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Deactivate Store
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Capacity Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-medium">
                        {store.currentOccupancy.toLocaleString()} / {store.capacity.toLocaleString()} units
                      </span>
                    </div>
                    <Progress value={occupancyPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {occupancyPercentage}% occupied
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{storeShelves.length}</p>
                        <p className="text-xs text-muted-foreground">Shelves</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{manager?.name || 'Unassigned'}</p>
                      <p className="text-xs text-muted-foreground">Manager</p>
                    </div>
                  </div>

                  {/* Shelf Preview */}
                  {storeShelves.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Shelves</p>
                      <div className="flex flex-wrap gap-1">
                        {storeShelves.slice(0, 4).map((shelf) => (
                          <span
                            key={shelf.id}
                            className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
                          >
                            {shelf.code}
                          </span>
                        ))}
                        {storeShelves.length > 4 && (
                          <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                            +{storeShelves.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Suspense>
  );
}
