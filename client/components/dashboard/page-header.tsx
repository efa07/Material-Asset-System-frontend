'use client';

import React from "react"

import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/80 px-5 py-4 shadow-[0_12px_40px_-26px_rgba(47,17,120,0.4)] md:flex-row md:items-center md:justify-between',
        className
      )}
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-6 rounded-full bg-primary" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
            Overview
          </span>
        </div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
