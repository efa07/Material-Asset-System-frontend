'use client';

import React from "react"

import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="flex min-h-screen text-foreground">
      <Sidebar />
      <div
        className={cn(
          'flex min-h-screen flex-1 flex-col transition-[padding] duration-300 ease-in-out',
          sidebarCollapsed ? 'pl-[76px]' : 'pl-64',
          className
        )}
      >
        <Navbar />
        <main className="relative flex-1 px-6 pb-10 pt-4 lg:px-8">
          <div className="relative z-10 mx-auto w-full max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
