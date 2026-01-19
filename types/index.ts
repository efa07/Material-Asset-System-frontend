// User Roles
export type UserRole = 
  | 'admin'
  | 'store-manager'
  | 'asset-manager'
  | 'technician'
  | 'employee'
  | 'auditor';

// User
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  createdAt: string;
  lastLogin?: string;
}

// Asset Status
export type AssetStatus = 
  | 'AVAILABLE'
  | 'IN_USE'
  | 'MAINTENANCE'
  | 'DISPOSED'
  | 'TRANSFERRED'
  | 'RESERVED';

// Request Status
export type RequestStatus = 
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED';

// Maintenance Status
export type MaintenanceStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

// Asset Category
export interface AssetCategory {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  createdAt: string;
}

// Store
export interface Store {
  id: string;
  name: string;
  location: string;
  managerId: string;
  capacity: number;
  currentOccupancy: number;
  createdAt: string;
}

// Shelf
export interface Shelf {
  id: string;
  storeId: string;
  name: string;
  code: string;
  capacity: number;
  currentOccupancy: number;
}

// Asset
export interface Asset {
  id: string;
  name: string;
  code: string;
  categoryId: string;
  storeId: string;
  shelfId?: string;
  status: AssetStatus;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  assignedTo?: string;
  description?: string;
  serialNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// Asset Assignment Request
export interface AssignmentRequest {
  id: string;
  assetId: string;
  requesterId: string;
  status: RequestStatus;
  reason: string;
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
}

// Asset Transfer Request
export interface TransferRequest {
  id: string;
  assetId: string;
  fromStoreId: string;
  toStoreId: string;
  requesterId: string;
  status: RequestStatus;
  reason: string;
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
}

// Maintenance Task
export interface MaintenanceTask {
  id: string;
  assetId: string;
  technicianId: string;
  type: 'preventive' | 'corrective' | 'inspection';
  status: MaintenanceStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
}

// Audit Log
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Asset History Entry
export interface AssetHistoryEntry {
  id: string;
  assetId: string;
  action: string;
  previousStatus?: AssetStatus;
  newStatus?: AssetStatus;
  performedBy: string;
  details: string;
  timestamp: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalAssets: number;
  assetsInUse: number;
  pendingRequests: number;
  maintenanceTasks: number;
  totalStores: number;
  totalUsers: number;
}

// Navigation Item
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: UserRole[];
  badge?: number;
  children?: NavItem[];
}
