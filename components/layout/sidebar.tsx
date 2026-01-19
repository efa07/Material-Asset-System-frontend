'use client';

import React from "react"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { getNavigationForRole, getRoleDisplayName } from '@/lib/navigation';
import { Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Settings,
  Archive,
  Package,
  ClipboardCheck,
  ArrowLeftRight,
  Bell,
  FolderTree,
  PackagePlus,
  Activity,
  History,
  ClipboardList,
  RefreshCw,
  BarChart3,
  RotateCcw,
  GitBranch,
  ScrollText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  Shield,
  Building2,
  FileText,
  Settings,
  Archive,
  Package,
  ClipboardCheck,
  ArrowLeftRight,
  Bell,
  FolderTree,
  PackagePlus,
  Activity,
  History,
  ClipboardList,
  RefreshCw,
  BarChart3,
  RotateCcw,
  GitBranch,
  ScrollText,
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, sidebarCollapsed, toggleSidebar } = useAppStore();

  if (!user) return null;

  const navItems = getNavigationForRole(user.role);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border/70 bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80 shadow-lg transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'w-[76px]' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-sidebar-border/80 px-4">
          <Link href={`/dashboard/${user.role}`} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sidebar-primary/10 border border-sidebar-primary/20 shadow-sm">
              <Shield className="h-5 w-5 text-sidebar-primary" aria-hidden />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">
                  INSA Admin
                </span>
                <span className="text-[11px] text-sidebar-foreground/60">
                  System Management
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Role Badge */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-b border-sidebar-border/80">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sidebar-accent/60 border border-sidebar-border/60">
              <div className="h-2 w-2 rounded-full bg-sidebar-primary shadow-[0_0_0_4px] shadow-sidebar-primary/15" />
              <span className="text-xs font-medium text-sidebar-foreground/80 tracking-wide">
                {getRoleDisplayName(user.role)}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const isActive = pathname === item.href;

              const navLink = (
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-sidebar-primary/15 via-sidebar-primary/10 to-transparent text-sidebar-foreground shadow-sm ring-1 ring-inset ring-sidebar-primary/30'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground hover:ring-1 hover:ring-sidebar-border/70'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/60'
                    )}
                    aria-hidden
                  />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                  {!sidebarCollapsed && item.badge && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-primary text-[10px] font-semibold text-sidebar-primary-foreground shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );

              if (sidebarCollapsed) {
                return (
                  <li key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                      <TooltipContent side="right" className="flex items-center gap-2">
                        {item.title}
                        {item.badge && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              }

              return <li key={item.href}>{navLink}</li>;
            })}
          </ul>
        </nav>

        {/* Collapse Toggle */}
        <div className="absolute -right-3 top-20">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-full border-sidebar-border/80 bg-sidebar shadow-md hover:bg-sidebar-accent"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
