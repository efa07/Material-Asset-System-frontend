'use client';

import React from "react"

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { useAppStore } from '@/store/useAppStore';
import { getRoleDashboardPath } from '@/lib/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    // Redirect to correct dashboard if on wrong role path
    const rolePath = getRoleDashboardPath(user.role);
    if (pathname === '/dashboard') {
      router.push(rolePath);
    }
  }, [isAuthenticated, user, router, pathname]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <AppShell>{children}</AppShell>
  );
}
