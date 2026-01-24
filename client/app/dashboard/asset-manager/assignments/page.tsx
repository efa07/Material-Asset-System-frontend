"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable } from "@/components/dashboard/data-table";
import { useAssets } from "@/hooks/useQueries";
import { Asset } from "@/types";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AssetAssignmentsPage() {
  const { data: assets, isLoading } = useAssets();

  // Filter assets that have an assigned user
  const assignedAssets = assets?.filter((asset) => asset.assignedToUserId) || [];

  const columns = [
    {
      key: "name",
      header: "Asset",
      cell: (asset: Asset) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{asset.name}</span>
          <span className="text-xs text-muted-foreground">{asset.serialNumber || "No S/N"}</span>
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
  ];

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Asset Assignments"
        description="Monitor assets currently assigned to employees."
      />
      
      <DataTable
        columns={columns}
        data={assignedAssets}
        emptyMessage="No assets are currently assigned to any user."
      />
    </div>
  );
}
