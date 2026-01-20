'use client';

import React from "react"

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  accentColor?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  accentColor,
}: StatsCardProps) {
  const accent = accentColor ?? 'var(--primary)';

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="h-3 w-3" />;
    if (trend.value < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const isPositive = trend && trend.value > 0;
  const isNegative = trend && trend.value < 0;

  return (
    <Card
      className={cn(
        'relative overflow-hidden border border-border/50 bg-card shadow-sm transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground tracking-wide">
                {title}
              </p>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
            </div>

            {trend && (
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold",
                    isPositive ? "text-emerald-500 bg-emerald-500/10" :
                      isNegative ? "text-rose-500 bg-rose-500/10" :
                        "text-muted-foreground bg-muted"
                  )}
                >
                  {getTrendIcon()}
                  <span>
                    {trend.value > 0 ? '+' : ''}{trend.value}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {trend.label}
                </p>
              </div>
            )}
            {description && !trend && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>

          {icon && (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-secondary/50"
              style={{
                color: accent,
              }}
            >
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
