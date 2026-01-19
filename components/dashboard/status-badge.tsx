'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { AssetStatus, RequestStatus, MaintenanceStatus } from '@/types';

type Status = AssetStatus | RequestStatus | MaintenanceStatus;

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  // Asset Status
  AVAILABLE: {
    label: 'Available',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  IN_USE: {
    label: 'In Use',
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  MAINTENANCE: {
    label: 'Maintenance',
    className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  DISPOSED: {
    label: 'Disposed',
    className: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  },
  TRANSFERRED: {
    label: 'Transferred',
    className: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  },
  RESERVED: {
    label: 'Reserved',
    className: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  },
  // Request Status
  PENDING: {
    label: 'Pending',
    className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-red-500/10 text-red-500 border-red-500/20',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  },
  // Maintenance Status
  SCHEDULED: {
    label: 'Scheduled',
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: 'bg-muted text-muted-foreground',
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium text-[10px] px-2 py-0.5 uppercase tracking-wide border',
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
