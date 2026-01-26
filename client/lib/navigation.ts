import type { UserRole } from '@/types';

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: UserRole[];
  badge?: number;
  children?: NavItem[];
}

export const navigationConfig: NavItem[] = [
  // Admin Navigation
  {
    title: 'Admin Dashboard',
    href: '/dashboard/admin',
    icon: 'LayoutDashboard',
    roles: ['admin'],
  },
  {
    title: 'User Management',
    href: '/dashboard/admin/users',
    icon: 'Users',
    roles: ['admin'],
  },
  {
    title: 'Roles & Permissions',
    href: '/dashboard/admin/roles',
    icon: 'Shield',
    roles: ['admin'],
  },
  {
    title: 'Store Registration',
    href: '/dashboard/admin/stores',
    icon: 'Building2',
    roles: ['admin'],
  },
  {
    title: 'Audit Logs',
    href: '/dashboard/admin/audit-logs',
    icon: 'FileText',
    roles: ['admin'],
  },
  {
    title: 'System Settings',
    href: '/dashboard/admin/settings',
    icon: 'Settings',
    roles: ['admin'],
  },

  // Store Manager Navigation
  {
    title: 'Store Dashboard',
    href: '/dashboard/store-manager',
    icon: 'LayoutDashboard',
    roles: ['store-manager'],
  },
  {
    title: 'Shelf Management',
    href: '/dashboard/store-manager/shelves',
    icon: 'Archive',
    roles: ['store-manager'],
  },
  {
    title: 'Asset Overview',
    href: '/dashboard/store-manager/assets',
    icon: 'Package',
    roles: ['store-manager'],
  },
  {
    title: 'Assignment Approvals',
    href: '/dashboard/store-manager/assignments',
    icon: 'ClipboardCheck',
    roles: ['store-manager'],
  },
  {
    title: 'Transfer Approvals',
    href: '/dashboard/store-manager/transfers',
    icon: 'ArrowLeftRight',
    roles: ['store-manager'],
  },
  {
    title: 'Disposal Approvals',
    href: '/dashboard/store-manager/disposals',
    icon: 'Trash2',
    roles: ['store-manager'],
  },
  {
    title: 'Notifications',
    href: '/dashboard/store-manager/notifications',
    icon: 'Bell',
    roles: ['store-manager'],
  },

  // Asset Manager Navigation
  {
    title: 'Asset Dashboard',
    href: '/dashboard/asset-manager',
    icon: 'LayoutDashboard',
    roles: ['asset-manager'],
  },
  {
    title: 'All Assets',
    href: '/dashboard/asset-manager/assets',
    icon: 'Package',
    roles: ['asset-manager'],
  },

  {
    title: 'Asset Assignments',
    href: '/dashboard/asset-manager/assignments',
    icon: 'Users',
    roles: ['asset-manager'],
  },
  {
    title: 'Maintenance',
    href: '/dashboard/asset-manager/maintenance',
    icon: 'Wrench',
    roles: ['asset-manager'],
  },
  {
    title: 'Status Tracking',
    href: '/dashboard/asset-manager/tracking',
    icon: 'Activity',
    roles: ['asset-manager'],
  },
  {
    title: 'Disposals',
    href: '/dashboard/asset-manager/disposals',
    icon: 'Trash2',
    roles: ['asset-manager'],
  },
  {
    title: 'Reports',
    href: '/dashboard/asset-manager/reports',
    icon: 'FileBarChart',
    roles: ['asset-manager'],
  },
  {
    title: 'Asset History',
    href: '/dashboard/asset-manager/history',
    icon: 'History',
    roles: ['asset-manager'],
  },

  // Technician Navigation
  {
    title: 'Maintenance Dashboard',
    href: '/dashboard/technician',
    icon: 'LayoutDashboard',
    roles: ['technician'],
  },
  {
    title: 'Assigned Tasks',
    href: '/dashboard/technician/tasks',
    icon: 'ClipboardList',
    roles: ['technician'],
  },
  {
    title: 'Update Status',
    href: '/dashboard/technician/update',
    icon: 'RefreshCw',
    roles: ['technician'],
  },
  {
    title: 'Performance Data',
    href: '/dashboard/technician/performance',
    icon: 'BarChart3',
    roles: ['technician'],
  },

  // Employee Navigation
  {
    title: 'My Dashboard',
    href: '/dashboard/employee',
    icon: 'LayoutDashboard',
    roles: ['employee'],
  },
  {
    title: 'Request Assignment',
    href: '/dashboard/employee/request-assignment',
    icon: 'PackagePlus',
    roles: ['employee'],
  },
  {
    title: 'Request Transfer',
    href: '/dashboard/employee/request-transfer',
    icon: 'ArrowLeftRight',
    roles: ['employee'],
  },
  {
    title: 'Request Return',
    href: '/dashboard/employee/request-return',
    icon: 'RotateCcw',
    roles: ['employee'],
  },
  {
    title: 'My Assets',
    href: '/dashboard/employee/my-assets',
    icon: 'Package',
    roles: ['employee'],
  },
  {
    title: 'Notifications',
    href: '/dashboard/employee/notifications',
    icon: 'Bell',
    roles: ['employee'],
  },

  // Auditor Navigation
  {
    title: 'Audit Dashboard',
    href: '/dashboard/auditor',
    icon: 'LayoutDashboard',
    roles: ['auditor'],
  },
  {
    title: 'Asset Lifecycle',
    href: '/dashboard/auditor/lifecycle',
    icon: 'GitBranch',
    roles: ['auditor'],
  },
  {
    title: 'Activity Logs',
    href: '/dashboard/auditor/activity',
    icon: 'ScrollText',
    roles: ['auditor'],
  },
];

export function getNavigationForRole(role: UserRole): NavItem[] {
  return navigationConfig.filter((item) => item.roles.includes(role));
}

export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    admin: 'Administrator',
    'store-manager': 'Store Manager',
    'asset-manager': 'Asset Manager',
    technician: 'Technician',
    employee: 'Employee',
    auditor: 'Auditor',
  };
  return displayNames[role];
}

export function getRoleDashboardPath(role: UserRole): string {
  const paths: Record<UserRole, string> = {
    admin: '/dashboard/admin',
    'store-manager': '/dashboard/store-manager',
    'asset-manager': '/dashboard/asset-manager',
    technician: '/dashboard/technician',
    employee: '/dashboard/employee',
    auditor: '/dashboard/auditor',
  };
  return paths[role];
}
