'use client';

import { useState } from 'react';
import { Check, X, Clock, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { useTransferRequests, useAssets, useStores, useUsers } from '@/hooks/useQueries';
import { useUpdateTransfer } from '@/hooks/useMutations';
import type { TransferRequest } from '@/types';

export default function TransfersPage() {
  const [selectedRequest, setSelectedRequest] = useState<TransferRequest | null>(null);
  const [dialogType, setDialogType] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');

  const { data: transferRequests = [], isLoading: requestsLoading } = useTransferRequests();
  const { data: assets = [], isLoading: assetsLoading } = useAssets();
  const { data: stores = [], isLoading: storesLoading } = useStores();
  const { data: users = [], isLoading: usersLoading } = useUsers();

  const updateTransfer = useUpdateTransfer();

  const pendingRequests = transferRequests.filter((r) => r.status === 'PENDING');
  const processedRequests = transferRequests.filter((r) => r.status !== 'PENDING');

  const handleAction = (request: TransferRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setDialogType(type);
    setNotes('');
  };

  const closeDialog = () => {
    setSelectedRequest(null);
    setDialogType(null);
    setNotes('');
  };

  const confirmAction = () => {
    if (!selectedRequest || !dialogType) return;

    const status = dialogType === 'approve' ? 'APPROVED' : 'REJECTED';
    
    updateTransfer.mutate({
      id: selectedRequest.id,
      status,
      // Pass notes if supported
      notes: notes
    } as any, {
      onSuccess: () => {
        closeDialog();
      }
    });
  };

  const renderRequestCard = (request: TransferRequest, showActions: boolean = false) => {
    // Lookup related data
    // Assuming request has assetId, fromStoreId, toStoreId, requesterId
    const asset = assets.find((a) => a.id === request.assetId);
    const requester = users.find((u) => u.id === (request.requesterId || (request as any).userId));
    const fromStore = stores.find((s) => s.id === request.fromStoreId);
    const toStore = stores.find((s) => s.id === request.toStoreId);

    return (
      <Card key={request.id} className="transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-medium">{asset?.name || 'Unknown Asset'}</p>
              <p className="text-xs text-muted-foreground font-mono">{asset?.code || asset?.barcode}</p>
            </div>
            <StatusBadge status={request.status as any} />
          </div>

          {/* Transfer Flow */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center border">
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">From</p>
                <p className="text-sm font-medium">{fromStore?.name || 'Unknown'}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-muted-foreground">To</p>
                <p className="text-sm font-medium">{toStore?.name || 'Unknown'}</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Requested by:</span>
              <span className="font-medium">{requester?.name || 'Unknown'}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Reason:</span>
              <p className="text-foreground mt-1">{(request as any).reason || (request as any).notes || '-'}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {(request as any).requestedAt ? new Date((request as any).requestedAt).toLocaleDateString() : 'N/A'}
            </div>
            {showActions && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
                  onClick={() => handleAction(request, 'reject')}
                >
                  <X className="h-3 w-3 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="h-8"
                  onClick={() => handleAction(request, 'approve')}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Approve
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (requestsLoading || assetsLoading || storesLoading || usersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transfer Requests"
        description="Manage inter-store asset transfer requests"
      />

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending <Badge variant="secondary" className="ml-2">{pendingRequests.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-4">
             {pendingRequests.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No pending requests</div>
             ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pendingRequests.map((req) => renderRequestCard(req, true))}
                </div>
             )}
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {processedRequests.map((req) => renderRequestCard(req, false))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedRequest} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'approve' ? 'Approve Transfer' : 'Reject Transfer'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'approve' 
                ? 'Are you sure you want to approve this transfer request?' 
                : 'Please provide a reason for rejecting this request.'}
            </DialogDescription>
          </DialogHeader>

           <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder={dialogType === 'approve' ? "Optional notes..." : "Reason for rejection..."}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button 
              variant={dialogType === 'reject' ? "destructive" : "default"}
              onClick={confirmAction}
              disabled={updateTransfer.isPending}
            >
              {updateTransfer.isPending ? "Processing..." : (dialogType === 'approve' ? 'Approve' : 'Reject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
