'use client';

import { useState } from 'react';
import { Plus, Search, Archive, MoreHorizontal, Package, Loader2, Check, ChevronsUpDown, LayoutGrid, List, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/dashboard/page-header';
import { useShelves, useStores, useAssets } from '@/hooks/useQueries';
import { useCreateShelf, useUpdateAsset, useUpdateShelf, useDeleteShelf } from '@/hooks/useMutations';

export default function ShelvesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [selectedShelfForAsset, setSelectedShelfForAsset] = useState<{id: string, storeId: string} | null>(null);
  const [selectedShelfForView, setSelectedShelfForView] = useState<{id: string, name: string} | null>(null);
  const [selectedShelfForEdit, setSelectedShelfForEdit] = useState<{id: string, name: string, description?: string, storeId: string} | null>(null);
  const [selectedShelfForDelete, setSelectedShelfForDelete] = useState<{id: string, name: string} | null>(null);
  const [selectedAssetForTransfer, setSelectedAssetForTransfer] = useState<{id: string, name: string} | null>(null);
  
  const [newShelf, setNewShelf] = useState({
    name: '',
    description: '',
    storeId: '',
  });
  const [editShelfData, setEditShelfData] = useState({
    name: '',
    description: '',
    storeId: '',
  });
  const [transferTargetShelfId, setTransferTargetShelfId] = useState<string>('');
  
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [openCombobox, setOpenCombobox] = useState(false);
  const [isViewAssetsDialogOpen, setIsViewAssetsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);

  const { data: shelves = [], isLoading: isLoadingShelves } = useShelves();
  const { data: stores = [], isLoading: isLoadingStores } = useStores();
  const { data: assets = [] } = useAssets();
  
  const createShelf = useCreateShelf();
  const updateShelf = useUpdateShelf();
  const deleteShelf = useDeleteShelf();
  const updateAsset = useUpdateAsset();

  const shelfAssets = selectedShelfForView 
    ? assets.filter(asset => asset.shelfId === selectedShelfForView.id)
    : [];

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

  const handleUpdateShelf = () => {
    if (!selectedShelfForEdit || !editShelfData.name || !editShelfData.storeId) return;

    updateShelf.mutate({
      id: selectedShelfForEdit.id,
      name: editShelfData.name,
      description: editShelfData.description,
      storeId: editShelfData.storeId,
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setSelectedShelfForEdit(null);
      },
    });
  };

  const handleDeleteShelf = () => {
    if (!selectedShelfForDelete) return;

    deleteShelf.mutate(selectedShelfForDelete.id, {
      onSuccess: () => {
        setSelectedShelfForDelete(null);
      }
    });
  };

  const handleOpenEditDialog = (shelf: any) => {
    setSelectedShelfForEdit(shelf);
    setEditShelfData({
      name: shelf.name,
      description: shelf.description || '',
      storeId: shelf.storeId,
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenTransferDialog = (asset: {id: string, name: string}) => {
    setSelectedAssetForTransfer(asset);
    setTransferTargetShelfId('');
    setIsTransferDialogOpen(true);
  };

  const handleTransferAsset = () => {
    if (!selectedAssetForTransfer || !transferTargetShelfId) return;
    
    // Find storeId of the target shelf
    const targetShelf = shelves.find(s => s.id === transferTargetShelfId);
    if (!targetShelf) return;

    updateAsset.mutate({
      id: selectedAssetForTransfer.id,
      shelfId: transferTargetShelfId,
      storeId: targetShelf.storeId, // Ensure storeId is also updated if shelf is in different store
    }, {
      onSuccess: () => {
        setIsTransferDialogOpen(false);
      }
    }); // This was previously missing
  };

  const handleOpenAssetDialog = (shelf: { id: string, storeId: string }) => {
    setSelectedShelfForAsset(shelf);
    setIsAssetDialogOpen(true);
  };

  const handleOpenViewAssetsDialog = (shelf: { id: string, name: string }) => {
    setSelectedShelfForView(shelf);
    setIsViewAssetsDialogOpen(true);
  };

  const handleAssignAssetToShelf = () => {
    if (!selectedAssetId || !selectedShelfForAsset) return;

    updateAsset.mutate({
      id: selectedAssetId,
      storeId: selectedShelfForAsset.storeId,
      shelfId: selectedShelfForAsset.id,
    }, {
      onSuccess: () => {
        setIsAssetDialogOpen(false);
        setSelectedAssetId('');
        setSelectedShelfForAsset(null);
      },
    });
  };

  const availableAssets = assets.filter(asset => 
    !asset.shelfId && 
    (asset.status === 'AVAILABLE' || asset.status === 'IN_USE')
  );

  const filteredShelves = shelves.filter((shelf) => {
    const matchesSearch =
      shelf.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStore = selectedStore === 'all' || shelf.storeId === selectedStore;
    return matchesSearch && matchesStore;
  });

  if (isLoadingShelves || isLoadingStores) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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

      <Dialog open={isAssetDialogOpen} onOpenChange={setIsAssetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Asset to Shelf</DialogTitle>
            <DialogDescription>
              Assign an existing asset to this shelf location.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="asset-select">Select Asset</Label>
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="justify-between w-full"
                  >
                    {selectedAssetId
                      ? availableAssets.find((asset) => asset.id === selectedAssetId)?.name
                      : "Select an available asset..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full" align="start">
                  <Command>
                    <CommandInput placeholder="Search by name or serial..." />
                    <CommandList>
                      <CommandEmpty>No asset found.</CommandEmpty>
                      <CommandGroup maxHeight="300px" className="overflow-y-auto">
                        {availableAssets.map((asset) => (
                          <CommandItem
                            key={asset.id}
                            value={`${asset.name} ${asset.serialNumber || ''}`}
                            onSelect={() => {
                              setSelectedAssetId(asset.id === selectedAssetId ? "" : asset.id);
                              setOpenCombobox(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedAssetId === asset.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{asset.name}</span>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {asset.serialNumber && <span>SN: {asset.serialNumber}</span>}
                                <Badge variant="outline" className="text-[10px] py-0 h-4">{asset.status}</Badge>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {availableAssets.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Only assets with 'AVAILABLE' or 'IN_USE' status and no current shelf assignment can be added.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssetDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssignAssetToShelf} 
              disabled={updateAsset.isPending || !selectedAssetId}
            >
              {updateAsset.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewAssetsDialogOpen} onOpenChange={setIsViewAssetsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Assets in {selectedShelfForView?.name}</DialogTitle>
            <DialogDescription>
              View and manage assets currently assigned to this shelf.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {shelfAssets.length > 0 ? (
              <ScrollArea className="h-[400px] w-full pr-4">
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                  {shelfAssets.map((asset) => (
                    <div key={asset.id} className="border rounded-lg p-3 flex items-start justify-between bg-card hover:bg-accent/10 transition-colors">
                      <div className="flex flex-col gap-1">
                         <div className="font-medium flex items-center gap-2">
                            {asset.name}
                            <Badge variant={asset.status === 'AVAILABLE' ? 'secondary' : 'outline'} className="text-[10px] py-0 h-5">
                              {asset.status}
                            </Badge>
                         </div>
                         {asset.serialNumber && <div className="text-xs text-muted-foreground">SN: {asset.serialNumber}</div>}
                         {asset.description && <div className="text-xs text-muted-foreground line-clamp-1 mt-1">{asset.description}</div>}
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 mt-1" onClick={() => handleOpenTransferDialog(asset)}>
                        <ArrowRightLeft className="h-3 w-3" />
                        <span className="sr-only">Transfer</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed rounded-lg">
                <Package className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No assets found in this shelf.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewAssetsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shelf</DialogTitle>
            <DialogDescription>
              Update shelf details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-store">Store</Label>
              <Select 
                value={editShelfData.storeId} 
                onValueChange={(value) => setEditShelfData({...editShelfData, storeId: value})}
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
              <Label htmlFor="edit-shelf-name">Shelf Name</Label>
              <Input 
                id="edit-shelf-name" 
                value={editShelfData.name}
                onChange={(e) => setEditShelfData({...editShelfData, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                value={editShelfData.description}
                onChange={(e) => setEditShelfData({...editShelfData, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateShelf} disabled={updateShelf.isPending}>
              {updateShelf.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!selectedShelfForDelete} onOpenChange={(open) => !open && setSelectedShelfForDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the shelf 
              <span className="font-semibold text-foreground"> {selectedShelfForDelete?.name} </span>
              and remove it from the system.
              {assets.some(a => a.shelfId === selectedShelfForDelete?.id) && (
                 <div className="mt-2 flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs font-medium">Warning: This shelf contains assets. They will be unassigned.</span>
                 </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteShelf} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteShelf.isPending}
            >
              {deleteShelf.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Asset</DialogTitle>
            <DialogDescription>
              Move <strong>{selectedAssetForTransfer?.name}</strong> to another shelf.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="transfer-shelf">Target Shelf</Label>
              <Select 
                value={transferTargetShelfId} 
                onValueChange={setTransferTargetShelfId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target shelf" />
                </SelectTrigger>
                <SelectContent>
                  {shelves
                    .filter(s => s.id !== selectedShelfForView?.id)
                    .map((shelf) => {
                      const shelfStore = stores.find(st => st.id === shelf.storeId);
                      return (
                        <SelectItem key={shelf.id} value={shelf.id}>
                           {shelf.name} ({shelfStore?.name || 'Unknown Store'})
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransferAsset} disabled={updateAsset.isPending || !transferTargetShelfId}>
              {updateAsset.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Transfer Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


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
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {storeShelves.map((shelf) => {
                      return (
                        <Card
                          key={shelf.id}
                          className="group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50"
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                  <Archive className="h-5 w-5" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-sm">{shelf.name}</h3>
                                  {shelf.description ? (
                                    <p className="text-xs text-muted-foreground line-clamp-1">{shelf.description}</p>
                                  ) : (
                                    <p className="text-xs text-muted-foreground italic">No description</p>
                                  )}
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleOpenViewAssetsDialog(shelf)}>
                                    View Assets
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleOpenEditDialog(shelf)}>Edit Shelf</DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setSelectedShelfForDelete(shelf)}
                                  >
                                    Delete Shelf
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs font-normal">
                                Active
                              </Badge>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-xs hover:bg-primary/10 hover:text-primary" 
                                onClick={() => handleOpenAssetDialog(shelf)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Asset
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border-2 border-dashed">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <LayoutGrid className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No shelves found</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
                      There are no shelves in this store matching your criteria.
                    </p>
                    <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Shelf
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
