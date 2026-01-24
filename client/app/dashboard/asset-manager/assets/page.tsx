"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  QrCode,
  MoreHorizontal,
  UserCheck,
  ArrowRightLeft,
  Trash2,
} from "lucide-react";
import type { Asset } from "@/types";
import { useAssets, useCategories, useStores, useUsers } from "@/hooks/useQueries";
import { useCreateAsset, useCreateAssignment, useCreateTransfer, useCreateDisposal } from "@/hooks/useMutations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AssetManagerAssetsPage() {
  const { data: assetsData, isLoading: assetsLoading } = useAssets();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: storesData, isLoading: storesLoading } = useStores();
  const { data: usersData } = useUsers();
  const { mutate: createAsset, isPending: isCreating } = useCreateAsset();
  const { mutate: assignAsset, isPending: isAssigning } = useCreateAssignment();
  const { mutate: transferAsset, isPending: isTransferring } = useCreateTransfer();
  const { mutate: disposeAsset, isPending: isDisposing } = useCreateDisposal();

  const stores = storesData || [];
  const categories = categoriesData || [];
  const users = usersData || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  // Action states
  const [actionAsset, setActionAsset] = useState<Asset | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [disposeDialogOpen, setDisposeDialogOpen] = useState(false);

  // Form states
  const [assignmentData, setAssignmentData] = useState({ userId: "", dueDate: "", notes: "" });
  const [transferData, setTransferData] = useState({ toStoreId: "", reason: "" });
  const [disposalData, setDisposalData] = useState({ reason: "", method: "", value: "" });

  const [newAsset, setNewAsset] = useState({
    name: "",
    serialNumber: "",
  categoryId: categories[0]?.id ?? "",
    description: "",
    purchaseDate: "",
    purchasePrice: "",
    storeId: "",
  });


  const filteredAssets = useMemo(() => {
    const list = assetsData || [];
    return list.filter((asset) => {
      const matchesSearch =
        (asset.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.serialNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.barcode || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || asset.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || asset.categoryId === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [assetsData, searchQuery, statusFilter, categoryFilter]);

  const handleAddAsset = () => {
    createAsset(
      {
        name: newAsset.name,
        serialNumber: newAsset.serialNumber || undefined,
        categoryId: newAsset.categoryId || categories[0]?.id || "",
        storeId: newAsset.storeId || undefined,
        purchaseDate: newAsset.purchaseDate || undefined,
        purchasePrice: newAsset.purchasePrice
          ? Number.parseFloat(newAsset.purchasePrice)
          : undefined,
        description: newAsset.description || undefined,
        status: "AVAILABLE",
      },
      {
        onSuccess: () => {
          setIsAddDialogOpen(false);
          setNewAsset({
            name: "",
            serialNumber: "",
            categoryId: categories[0]?.id ?? "",
            description: "",
            purchaseDate: "",
            purchasePrice: "",
            storeId: "",
          });
        },
      }
    );
  };

  const handleAssign = () => {
    if (!actionAsset) return;
    assignAsset(
      {
        assetId: actionAsset.id,
        userId: assignmentData.userId,
        dueDate: assignmentData.dueDate || undefined,
        notes: assignmentData.notes || undefined,
        status: "ACTIVE",
      },
      {
        onSuccess: () => {
          setAssignDialogOpen(false);
          setAssignmentData({ userId: "", dueDate: "", notes: "" });
          setActionAsset(null);
        },
      }
    );
  };

  const handleTransfer = () => {
    if (!actionAsset) return;
    transferAsset(
      {
        assetId: actionAsset.id,
        fromStoreId: actionAsset.storeId || undefined,
        toStoreId: transferData.toStoreId,
        reason: transferData.reason || undefined,
        status: "COMPLETED",
      },
      {
        onSuccess: () => {
          setTransferDialogOpen(false);
          setTransferData({ toStoreId: "", reason: "" });
          setActionAsset(null);
        },
      }
    );
  };

  const handleDispose = () => {
    if (!actionAsset) return;
    disposeAsset(
      {
        assetId: actionAsset.id,
        reason: disposalData.reason || undefined,
        method: disposalData.method || undefined,
        value: disposalData.value ? Number(disposalData.value) : undefined,
      },
      {
        onSuccess: () => {
          setDisposeDialogOpen(false);
          setDisposalData({ reason: "", method: "", value: "" });
          setActionAsset(null);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {(assetsLoading || categoriesLoading || storesLoading) ? (
        <div>Loading...</div>
      ) : (
        <>
          <PageHeader
            title="Asset Management"
            description="View and manage all assets in the system"
          >
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
                <DialogDescription>
                  Enter the details for the new asset.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Asset Name</Label>
                  <Input
                    id="name"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    placeholder="Enter asset name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={newAsset.serialNumber}
                    onChange={(e) => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                    placeholder="Enter serial number"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newAsset.categoryId}
                      onValueChange={(value) => setNewAsset({ ...newAsset, categoryId: value })}
                    >
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
                    <Label htmlFor="store">Store</Label>
                    <Select
                      value={newAsset.storeId}
                      onValueChange={(value) => setNewAsset({ ...newAsset, storeId: value })}
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={newAsset.purchaseDate}
                      onChange={(e) => setNewAsset({ ...newAsset, purchaseDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purchasePrice">Purchase Price</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      value={newAsset.purchasePrice}
                      onChange={(e) => setNewAsset({ ...newAsset, purchasePrice: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAsset.description}
                    onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                    placeholder="Enter asset description"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAsset} disabled={!newAsset.name.trim() || isCreating}>
                  Add Asset
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      </PageHeader>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold">
              Assets ({filteredAssets.length})
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="IN_USE">In Use</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="DISPOSED">Disposed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Asset</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {asset.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {asset.serialNumber || "—"}
                    </TableCell>
                    <TableCell>
                      {asset.category?.name ||
                        categories.find((c) => c.id === asset.categoryId)?.name ||
                        "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={asset.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {asset.barcode || asset.qrCode || "—"}
                    </TableCell>
                    <TableCell>
                      {asset.purchasePrice
                        ? `$${Number(asset.purchasePrice).toLocaleString()}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedAsset(asset)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setActionAsset(asset);
                              setAssignDialogOpen(true);
                            }}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Assign User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setActionAsset(asset);
                              setTransferDialogOpen(true);
                            }}
                          >
                            <ArrowRightLeft className="mr-2 h-4 w-4" />
                            Transfer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setActionAsset(asset);
                              setDisposeDialogOpen(true);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Dispose
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedAsset}
        onOpenChange={() => setSelectedAsset(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
            <DialogDescription>
              Complete information about this asset
            </DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedAsset.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedAsset.serialNumber}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedAsset.status} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Barcode</p>
                  <p className="font-medium">
                    {selectedAsset.barcode || selectedAsset.qrCode || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium capitalize">
                    {selectedAsset.category?.name ||
                      categories.find((c) => c.id === selectedAsset.categoryId)?.name ||
                      "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Purchase Date</p>
                  <p className="font-medium">
                    {selectedAsset.purchaseDate
                      ? new Date(selectedAsset.purchaseDate).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Purchase Price</p>
                  <p className="font-medium">
                    {selectedAsset.purchasePrice
                      ? `$${Number(selectedAsset.purchasePrice).toLocaleString()}`
                      : "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Store</p>
                  <p className="font-medium">
                    {selectedAsset.store?.name ||
                      stores.find((s) => s.id === selectedAsset.storeId)?.name ||
                      "—"}
                  </p>
                </div>
              </div>
              {selectedAsset.description && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedAsset.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAsset(null)}>
              Close
            </Button>
            <Button>Edit Asset</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Asset</DialogTitle>
            <DialogDescription>
              Assign {actionAsset?.name} to a user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="assign-user">User</Label>
              <Select
                value={assignmentData.userId}
                onValueChange={(value) =>
                  setAssignmentData({ ...assignmentData, userId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assign-date">Due Date (Optional)</Label>
              <Input
                id="assign-date"
                type="date"
                value={assignmentData.dueDate}
                onChange={(e) =>
                  setAssignmentData({ ...assignmentData, dueDate: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assign-notes">Notes</Label>
              <Textarea
                id="assign-notes"
                value={assignmentData.notes}
                onChange={(e) =>
                  setAssignmentData({ ...assignmentData, notes: e.target.value })
                }
                placeholder="Add assignment notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={isAssigning || !assignmentData.userId}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Asset</DialogTitle>
            <DialogDescription>
              Transfer {actionAsset?.name} to another store.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="transfer-store">Destination Store</Label>
              <Select
                value={transferData.toStoreId}
                onValueChange={(value) =>
                  setTransferData({ ...transferData, toStoreId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  {stores
                    .filter((s) => s.id !== actionAsset?.storeId)
                    .map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="transfer-reason">Reason</Label>
              <Textarea
                id="transfer-reason"
                value={transferData.reason}
                onChange={(e) =>
                  setTransferData({ ...transferData, reason: e.target.value })
                }
                placeholder="Reason for transfer..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransfer} disabled={isTransferring || !transferData.toStoreId}>
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={disposeDialogOpen} onOpenChange={setDisposeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispose Asset</DialogTitle>
            <DialogDescription>
              Mark {actionAsset?.name} as disposed. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dispose-method">Disposal Method</Label>
              <Select
                value={disposalData.method}
                onValueChange={(value) =>
                  setDisposalData({ ...disposalData, method: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOLD">Sold</SelectItem>
                  <SelectItem value="RECYCLED">Recycled</SelectItem>
                  <SelectItem value="DESTROYED">Destroyed</SelectItem>
                  <SelectItem value="DONATED">Donated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dispose-value">Value / Price (Optional)</Label>
              <Input
                id="dispose-value"
                type="number"
                placeholder="0.00"
                value={disposalData.value}
                onChange={(e) =>
                  setDisposalData({ ...disposalData, value: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dispose-reason">Reason</Label>
              <Textarea
                id="dispose-reason"
                value={disposalData.reason}
                onChange={(e) =>
                  setDisposalData({ ...disposalData, reason: e.target.value })
                }
                placeholder="Why is this asset being disposed?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisposeDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDispose}
              disabled={isDisposing || !disposalData.method}
            >
              Dispose Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </>
      )}
    </div>
  );
}
