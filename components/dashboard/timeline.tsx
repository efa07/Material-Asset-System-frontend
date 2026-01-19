'use client';

import React from "react"

import { cn } from '@/lib/utils';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'info';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const statusColors = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {items.map((item, index) => (
        <div key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
          {/* Timeline line */}
          {index !== items.length - 1 && (
            <div className="absolute left-[11px] top-6 h-full w-px bg-border" />
          )}

          {/* Timeline dot */}
          <div className="relative">
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border-2 border-background',
                item.status ? statusColors[item.status] : 'bg-muted'
              )}
            >
              {item.icon && (
                <div className="text-background">{item.icon}</div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1 pt-0.5">
            <p className="text-sm font-medium text-foreground">{item.title}</p>
            {item.description && (
              <p className="text-xs text-muted-foreground">{item.description}</p>
            )}
            <p className="text-[10px] text-muted-foreground/60">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
