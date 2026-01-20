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
import { mockTransferRequests, mockAssets, mockStores } from '@/lib/mock-data';
import { mockUsers } from '@/store/useAppStore';
import type { TransferRequest } from '@/types';

export default function TransfersPage() {
  const [selectedRequest, setSelectedRequest] = useState<TransferRequest | null>(null);
  const [dialogType, setDialogType] = useState<'approve' | 'reject' | null>(null);

  const pendingRequests = mockTransferRequests.filter((r) => r.status === 'PENDING');
  const processedRequests = mockTransferRequests.filter((r) => r.status !== 'PENDING');

  const handleAction = (request: TransferRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setDialogType(type);
  };

  const closeDialog = () => {
    setSelectedRequest(null);
    setDialogType(null);
  };

  const renderRequestCard = (request: TransferRequest, showActions: boolean = false) => {
    const asset = mockAssets.find((a) => a.id === request.assetId);
    const requester = Object.values(mockUsers).find((u) => u.id === request.requesterId);
    const fromStore = mockStores.find((s) => s.id === request.fromStoreId);
    const toStore = mockStores.find((s) => s.id === request.toStoreId);

    return (
      <Card key={request.id} className="transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-medium">{asset?.name || 'Unknown Asset'}</p>
              <p className="text-xs text-muted-foreground font-mono">{asset?.code}</p>
            </div>
            <StatusBadge status={request.status} />
          </div>

          {/* Transfer Flow */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center border">
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">From</p>
                <p className="text-sm font-medium">{fromStore?.name}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-muted-foreground">To</p>
                <p className="text-sm font-medium">{toStore?.name}</p>
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
              <p className="text-foreground mt-1">{request.reason}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(request.requestedAt).toLocaleDateString()}
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
            {!showActions && request.processedAt && (
              <span className="text-xs text-muted-foreground">
                Processed: {new Date(request.processedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transfer Approvals"
        description="Review and process asset transfer requests between stores"
      />

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingRequests.length > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="processed">Processed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingRequests.map((request) => renderRequestCard(request, true))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Check className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-sm text-muted-foreground">
                  No pending transfer requests to review
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="processed" className="space-y-4">
          {processedRequests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {processedRequests.map((request) => renderRequestCard(request, false))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">No processed requests yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Approval/Rejection Dialog */}
      <Dialog open={!!dialogType} onOpenChange={closeDialog}>
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
          {selectedRequest && (
            <div className="py-4">
              <div className="p-3 rounded-lg bg-muted space-y-2">
                <p className="text-sm font-medium">
                  {mockAssets.find((a) => a.id === selectedRequest.assetId)?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mockStores.find((s) => s.id === selectedRequest.fromStoreId)?.name} →{' '}
                  {mockStores.find((s) => s.id === selectedRequest.toStoreId)?.name}
                </p>
              </div>
              {dialogType === 'reject' && (
                <div className="mt-4 space-y-2">
                  <Label>Rejection Reason</Label>
                  <Textarea placeholder="Enter the reason for rejection..." />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              variant={dialogType === 'reject' ? 'destructive' : 'default'}
              onClick={closeDialog}
            >
              {dialogType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
