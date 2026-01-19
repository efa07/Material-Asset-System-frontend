import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, Notification } from '@/types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // UI State
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
}

// Mock users for different roles
export const mockUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    email: 'admin@insa.gov',
    name: 'Administrator',
    role: 'admin',
    department: 'IT Administration',
    createdAt: '2024-01-01',
    lastLogin: '2025-01-19',
  },
  'store-manager': {
    id: '2',
    email: 'store.manager@insa.gov',
    name: 'Sarah Johnson',
    role: 'store-manager',
    department: 'Logistics',
    createdAt: '2024-02-15',
    lastLogin: '2025-01-19',
  },
  'asset-manager': {
    id: '3',
    email: 'asset.manager@insa.gov',
    name: 'Michael Chen',
    role: 'asset-manager',
    department: 'Asset Management',
    createdAt: '2024-03-10',
    lastLogin: '2025-01-19',
  },
  technician: {
    id: '4',
    email: 'technician@insa.gov',
    name: 'David Williams',
    role: 'technician',
    department: 'Maintenance',
    createdAt: '2024-04-20',
    lastLogin: '2025-01-19',
  },
  employee: {
    id: '5',
    email: 'employee@insa.gov',
    name: 'Emily Brown',
    role: 'employee',
    department: 'Operations',
    createdAt: '2024-05-05',
    lastLogin: '2025-01-19',
  },
  auditor: {
    id: '6',
    email: 'auditor@insa.gov',
    name: 'Robert Taylor',
    role: 'auditor',
    department: 'Internal Audit',
    createdAt: '2024-06-12',
    lastLogin: '2025-01-19',
  },
};

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'New Asset Request',
    message: 'Emily Brown requested a laptop assignment',
    type: 'info',
    read: false,
    createdAt: '2025-01-19T10:30:00Z',
  },
  {
    id: '2',
    userId: '1',
    title: 'Maintenance Completed',
    message: 'Server maintenance task has been completed',
    type: 'success',
    read: false,
    createdAt: '2025-01-19T09:15:00Z',
  },
  {
    id: '3',
    userId: '1',
    title: 'Transfer Pending Approval',
    message: '5 assets pending transfer approval',
    type: 'warning',
    read: true,
    createdAt: '2025-01-18T16:45:00Z',
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      sidebarCollapsed: false,
      theme: 'dark',
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter((n) => !n.read).length,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      login: (user) => set({ user, isAuthenticated: true }),
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      setTheme: (theme) => set({ theme }),
      
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),
      
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      })),
      
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'insa-ams-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
