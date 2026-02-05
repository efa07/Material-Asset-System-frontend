'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { DataTable, type Column } from '@/components/dashboard/data-table';
import { useAssetReturns } from '@/hooks/useQueries';
import { useApproveReturn } from '@/hooks/useMutations';
import type { AssetReturn } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Check, Package, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ReturnedAssetsPage() {
    const { data: assetReturns = [], isLoading } = useAssetReturns();
    const approveReturn = useApproveReturn();
    const [selectedReturn, setSelectedReturn] = useState<AssetReturn | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenApproveDialog = (item: AssetReturn) => {
        setSelectedReturn(item);
        setIsDialogOpen(true);
    };

    const handleConfirmApprove = () => {
        if (selectedReturn) {
            approveReturn.mutate(selectedReturn.id, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setSelectedReturn(null);
                }
            });
        }
    };

    const columns: Column<AssetReturn>[] = [
        {
            key: 'assetId',
            header: 'Asset',
            cell: (item) => (
                <div className="flex flex-col">
                    <span className="font-medium">{item.asset?.name || 'Unknown Asset'}</span>
                    <span className="text-xs text-muted-foreground">{item.asset?.serialNumber || 'No S/N'}</span>
                </div>
            )
        },
        {
            key: 'userId',
            header: 'Returned By',
            cell: (item) => (
                 <div className="flex flex-col">
                    <span className="font-medium">{item.user?.firstName || ''} {item.user?.lastName || ''}</span>
                    <span className="text-xs text-muted-foreground">{item.user?.email || 'Unknown User'}</span>
                </div>
            )
        },
        {
            key: 'returnDate',
            header: 'Return Date',
            cell: (item) => item.returnDate ? format(new Date(item.returnDate), 'PPP') : 'N/A'
        },
        {
            key: 'status',
            header: 'Status',
            cell: (item) => (
                <Badge variant={item.status === 'APPROVED' ? 'default' : item.status === 'REJECTED' ? 'destructive' : 'outline'}>
                    {item.status}
                </Badge>
            )
        },
        {
            key: 'notes',
            header: 'Notes',
            cell: (item) => item.notes || '-'
        },
        {
            key: 'id', // Actions
            header: 'Actions',
            cell: (item) => item.status === 'PENDING' ? (
                <Button 
                    size="sm" 
                    onClick={() => handleOpenApproveDialog(item)}
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/10 text-primary"
                >
                    <Check className="h-4 w-4 mr-2" />
                    Review
                </Button>
            ) : null
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                icon={Package} 
                title="Returned Assets" 
                description="Manage asset return requests."
            />
            
            <DataTable 
                columns={columns} 
                data={assetReturns} 
                loading={isLoading}
                searchKey="notes" 
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Return Approval</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to approve this asset return? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedReturn && (
                        <div className="py-4 space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border text-sm">
                                <Package className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Asset: {selectedReturn.asset?.name}</p>
                                    <p className="text-muted-foreground text-xs">S/N: {selectedReturn.asset?.serialNumber}</p>
                                </div>
                            </div>

                             <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border text-sm">
                                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium">Return Condition / Notes</p>
                                    <p className="text-muted-foreground">{selectedReturn.notes || "No notes provided"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleConfirmApprove} 
                            disabled={approveReturn.isPending}
                        >
                            {approveReturn.isPending ? "Processing..." : "Confirm Approval"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
