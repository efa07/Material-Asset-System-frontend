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
        'relative mt-2 mb-6 flex flex-col gap-4 overflow-hidden rounded-3xl border border-border/30 bg-card/70 px-8 py-8 shadow-[0_12px_40px_-30px_rgba(37,99,235,0.45)] backdrop-blur md:flex-row md:items-center md:justify-between',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-x-10 top-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      <div className="space-y-1.5 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-6 items-center justify-center rounded-full bg-primary/10 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary shadow-sm ring-1 ring-inset ring-primary/30">
            Overview
          </div>
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(37,99,235,0.7)]" />
        </div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="relative z-10 flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
