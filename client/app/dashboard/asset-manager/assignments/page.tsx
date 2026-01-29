"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable } from "@/components/dashboard/data-table";
import { useAssets, useUsers } from "@/hooks/useQueries";
import { useCreateAssignment } from "@/hooks/useMutations";
import { Asset } from "@/types";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  ArrowLeftRight,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Label } from "@/components/ui/label";

export default function AssetAssignmentsPage() {
  const { data: assets, isLoading } = useAssets();
  const { data: users } = useUsers();
  const { mutate: assignAsset, isPending: isAssigning } = useCreateAssignment();

  const [reassignAsset, setReassignAsset] = useState<Asset | null>(null);
  const [targetUserId, setTargetUserId] = useState<string>("");

  // Pagination and Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter assets that have an assigned user
  const assignedAssets = assets?.filter((asset) => asset.assignedToUserId) || [];

  // Filter based on search query
  const filteredAssets = assignedAssets.filter((asset) => {
    const query = searchQuery.toLowerCase();
    const assetName = asset.name.toLowerCase();
    const serial = (asset.serialNumber || "").toLowerCase();
    const userName = asset.assignedToUser
      ? `${asset.assignedToUser.firstName || ""} ${asset.assignedToUser.lastName || ""}`.toLowerCase()
      : "";

    return (
      assetName.includes(query) ||
      serial.includes(query) ||
      userName.includes(query)
    );
  });

  // Pagination logic
  const totalItems = filteredAssets.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentAssets = filteredAssets.slice(startIndex, endIndex);

  // Reset page when search changes
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const handleReassign = () => {
    if (!reassignAsset || !targetUserId) return;

    assignAsset(
      {
        assetId: reassignAsset.id,
        userId: targetUserId,
        status: "ACTIVE",
        notes: "Reassigned via Dashboard",
      },
      {
        onSuccess: () => {
          setReassignAsset(null);
          setTargetUserId("");
        },
      }
    );
  };

  const columns = [
    {
      key: "name",
      header: "Asset",
      cell: (asset: Asset) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{asset.name}</span>
          <span className="text-xs text-muted-foreground">
            {asset.serialNumber || "No S/N"}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (asset: Asset) => asset.category?.name || "Uncategorized",
    },
    {
      key: "user",
      header: "Assigned User",
      cell: (asset: Asset) => {
        const user = asset.assignedToUser;
        if (!user) return <span className="text-muted-foreground">-</span>;

        const initials = ((user.firstName?.[0] || "") + (user.lastName?.[0] || "")).toUpperCase();

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name || "User"} />
              <AvatarFallback className="text-xs bg-muted">
                {initials || "??"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (asset: Asset) => <StatusBadge status={asset.status} />,
    },
    {
      key: "actions",
      header: "",
      cell: (asset: Asset) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setReassignAsset(asset)}>
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Reassign User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center bg-blue-300">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4">
      <PageHeader
        title="Asset Assignments"
        description="Monitor assets currently assigned to employees."
        className="mb-8"
      />

      <div className="flex items-center justify-between py-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets, users, or serial..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <DataTable
          columns={columns}
          data={currentAssets}
          emptyMessage={
            searchQuery
              ? "No matching assignments found."
              : "No assets are currently assigned to any user."
          }
        />
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} assignments
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 lg:flex"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-sm font-medium">
             Page {currentPage} of {totalPages || 1}
          </div>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 lg:flex"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog
        open={!!reassignAsset}
        onOpenChange={(open) => {
          if (!open) {
            setReassignAsset(null);
            setTargetUserId("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Asset</DialogTitle>
            <DialogDescription>
              Select a new user to assign <strong>{reassignAsset?.name}</strong> to.
              This will return the asset from the current user.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user">New User</Label>
              <Select value={targetUserId} onValueChange={setTargetUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReassignAsset(null)}
              disabled={isAssigning}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReassign}
              disabled={!targetUserId || isAssigning}
            >
              {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reassign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
