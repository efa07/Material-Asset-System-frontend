import React from "react"

import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card } from './card';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  onAction,
  actionLabel,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        'flex flex-col items-center justify-center gap-3 border-dashed border-border/70 bg-card/70 py-10 text-center',
        className
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action ? (
        action
      ) : (
        onAction &&
        actionLabel && (
          <Button onClick={onAction} variant="default">
            {actionLabel}
          </Button>
        )
      )}
    </Card>
  );
}
