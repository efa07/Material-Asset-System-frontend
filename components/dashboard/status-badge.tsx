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
    className: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
  },
  IN_USE: {
    label: 'In Use',
    className: 'bg-primary/12 text-primary border-primary/30',
  },
  MAINTENANCE: {
    label: 'Maintenance',
    className: 'bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/25',
  },
  DISPOSED: {
    label: 'Disposed',
    className: 'bg-muted text-muted-foreground border-border/70',
  },
  TRANSFERRED: {
    label: 'Transferred',
    className: 'bg-violet-500/12 text-violet-600 dark:text-violet-300 border-violet-500/25',
  },
  RESERVED: {
    label: 'Reserved',
    className: 'bg-orange-500/12 text-orange-600 dark:text-orange-400 border-orange-500/25',
  },
  // Request Status
  PENDING: {
    label: 'Pending',
    className: 'bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/25',
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-red-500/12 text-red-600 dark:text-red-400 border-red-500/25',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-primary/12 text-primary border-primary/30',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-muted text-muted-foreground border-border/70',
  },
  // Maintenance Status
  SCHEDULED: {
    label: 'Scheduled',
    className: 'bg-primary/12 text-primary border-primary/30',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/25',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: 'bg-muted text-muted-foreground',
  };

  return (
    <Badge
      className={cn(
        'font-semibold text-[10px] px-2.5 py-1 uppercase tracking-wide border',
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
