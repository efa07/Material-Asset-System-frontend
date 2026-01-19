'use client';

import React from "react"

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { useAppStore } from '@/store/useAppStore';
import { getRoleDashboardPath } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, sidebarCollapsed } = useAppStore();

  useEffect(() => {
    // Redirect to login if not authenticated
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
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            sidebarCollapsed ? 'ml-[68px]' : 'ml-64'
          )}
        >
          <Navbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
