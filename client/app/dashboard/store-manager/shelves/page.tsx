'use client';

import { useState } from 'react';
import { Plus, Search, Archive, MoreHorizontal, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/dashboard/page-header';
import { useShelves, useStores } from '@/hooks/useQueries';
import { useCreateShelf } from '@/hooks/useMutations';

export default function ShelvesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [newShelf, setNewShelf] = useState({
    name: '',
    description: '',
    storeId: '',
  });

  const { data: shelves = [], isLoading: isLoadingShelves } = useShelves();
  const { data: stores = [], isLoading: isLoadingStores } = useStores();
  const createShelf = useCreateShelf();

  const handleCreateShelf = () => {
    if (!newShelf.name || !newShelf.storeId) return;
    
    createShelf.mutate({
      name: newShelf.name,
      description: newShelf.description,
      storeId: newShelf.storeId,
    }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setNewShelf({ name: '', description: '', storeId: '' });
      },
    });
  };

  const filteredShelves = shelves.filter((shelf) => {
    const matchesSearch =
      shelf.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStore = selectedStore === 'all' || shelf.storeId === selectedStore;
    return matchesSearch && matchesStore;
  });

  if (isLoadingShelves || isLoadingStores) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shelf Management"
        description="Organize and manage storage shelves across stores"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Shelf
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Shelf</DialogTitle>
              <DialogDescription>
                Create a new shelf in a storage location.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="store">Store</Label>
                <Select 
                  value={newShelf.storeId} 
                  onValueChange={(value) => setNewShelf({...newShelf, storeId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shelf-name">Shelf Name</Label>
                <Input 
                  id="shelf-name" 
                  placeholder="e.g., Shelf A1" 
                  value={newShelf.name}
                  onChange={(e) => setNewShelf({...newShelf, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Optional description" 
                  value={newShelf.description}
                  onChange={(e) => setNewShelf({...newShelf, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateShelf} disabled={createShelf.isPending}>
                {createShelf.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Shelf
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search shelves by name..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Shelves by Store */}
        {stores.map((store) => {
          const storeShelves = filteredShelves.filter((s) => s.storeId === store.id);
          if (selectedStore !== 'all' && selectedStore !== store.id) return null;
          if (storeShelves.length === 0 && searchQuery) return null;

          return (
            <Card key={store.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">{store.name}</CardTitle>
                    <CardDescription>{store.location}</CardDescription>
                  </div>
                  <Badge variant="secondary">{storeShelves.length} shelves</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {storeShelves.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {storeShelves.map((shelf) => {
                      return (
                        <div
                          key={shelf.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center`}>
                              <Archive className={`h-5 w-5 text-emerald-500`} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{shelf.name}</p>
                              {shelf.description && (
                                <p className="text-xs text-muted-foreground truncate max-w-[150px]">{shelf.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Assets</DropdownMenuItem>
                                <DropdownMenuItem>Edit Shelf</DropdownMenuItem>
                                <DropdownMenuItem>Move Assets</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Delete Shelf
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Package className="h-10 w-10 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">No shelves in this store</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
