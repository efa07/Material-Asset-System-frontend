'use client';

import { useState } from 'react';
import { Check, X, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useAssignmentRequests, useAssets, useUsers } from '@/hooks/useQueries';
import { useUpdateAssignment } from '@/hooks/useMutations';
import type { Assignment, User as UserType, Asset } from '@/types';

export default function AssignmentsPage() {
  const [selectedRequest, setSelectedRequest] = useState<Assignment | null>(null);
  const [dialogType, setDialogType] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');

  const { data: assignmentRequests = [], isLoading: requestsLoading } = useAssignmentRequests();
  const { data: assets = [], isLoading: assetsLoading } = useAssets();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  
  const updateAssignment = useUpdateAssignment();

  const pendingRequests = assignmentRequests.filter((r) => r.status === 'PENDING');
  const processedRequests = assignmentRequests.filter((r) => r.status !== 'PENDING');

  const handleAction = (request: Assignment, type: 'approve' | 'reject') => {
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

    const status = dialogType === 'approve' ? 'ACTIVE' : 'REJECTED';
    
    updateAssignment.mutate({
      id: selectedRequest.id,
      status,
      // Pass notes if API supports it, assuming 'notes' or 'comments' field
      notes: notes
    }, {
      onSuccess: () => {
        closeDialog();
      }
    });
  };

  const renderRequestCard = (request: Assignment, showActions: boolean = false) => {
    // Some API responses might include 'asset' and 'user' relation objects directly.
    // If not, we look them up.
    const asset = (request as any).asset || assets.find((a) => a.id === request.assetId);
    const requester = (request as any).user || users.find((u) => u.id === (request as any).userId || u.id === (request as any).requesterId);

    return (
      <Card key={request.id} className="transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{requester?.name || requester?.firstName || 'Unknown User'}</p>
                <p className="text-xs text-muted-foreground">{requester?.department || requester?.email}</p>
              </div>
            </div>
            <StatusBadge status={request.status as any} />
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Asset:</span>
              <span className="font-medium">{asset?.name || 'Unknown Asset'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Code:</span>
              <span className="font-mono text-xs">{asset?.code || asset?.barcode}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Reason:</span>
              <p className="text-foreground mt-1">{(request as any).reason || '-'}</p>
            </div>
             {/* If processed, show notes/comments if available */}
             {!showActions && (request as any).notes && (
                <div className="text-sm mt-2 pt-2 border-t border-dashed">
                  <span className="text-muted-foreground">Notes:</span>
                  <p className="text-foreground mt-1 italic">{(request as any).notes}</p>
                </div>
             )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {(request as any).createdAt || (request as any).assignedDate ? new Date((request as any).createdAt || (request as any).assignedDate).toLocaleDateString() : 'N/A'}
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

  if (requestsLoading || assetsLoading || usersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Requests"
        description="Manage asset assignment and return requests"
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
              {dialogType === 'approve' ? 'Approve Request' : 'Reject Request'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'approve' 
                ? 'Are you sure you want to approve this asset request?' 
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
              disabled={updateAssignment.isPending}
            >
              {updateAssignment.isPending ? "Processing..." : (dialogType === 'approve' ? 'Approve' : 'Reject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
