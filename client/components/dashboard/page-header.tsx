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
        'relative -mx-6 -mt-4 mb-8 flex flex-col gap-4 border-b border-border/40 bg-gradient-to-br from-primary/10 via-background to-accent/20 px-6 py-8 md:flex-row md:items-center md:justify-between lg:-mx-8 lg:px-8',
        className
      )}
    >
      {/* Decorative background accent */}
      <div className="absolute right-0 top-0 -z-10 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent blur-3xl" />
      
      <div className="space-y-1.5 relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-5 items-center justify-center rounded-full bg-primary/10 px-2.5 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm ring-1 ring-inset ring-primary/20">
            Overview
          </div>
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
