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
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive?: boolean;
  avatar?: string;
  department?: string;
  createdAt: string;
  lastLogin?: string;
  currentAssets?: Asset[];
  assignments?: Assignment[];
}

// Asset Status
export type AssetStatus =
  | 'AVAILABLE'
  | 'IN_USE'
  | 'MAINTENANCE'
  | 'RETIRED'
  | 'DISPOSED'
  | 'LOST';

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
  description?: string | null;
  createdAt: string;
  updatedAt?: string;
}

// Store
export interface Store {
  id: string;
  name: string;
  location?: string | null;
  description?: string | null;
  isActive?: boolean;
  shelves?: Shelf[];
  createdAt: string;
  updatedAt?: string;
}

// Shelf
export interface Shelf {
  id: string;
  storeId: string;
  name: string;
  description?: string | null;
  store?: Store;
  createdAt?: string;
  updatedAt?: string;
}

// Asset
export interface Asset {
  id: string;
  name: string;
  categoryId: string;
  category?: AssetCategory;
  storeId?: string | null;
  store?: Store;
  shelfId?: string;
  shelf?: Shelf;
  status: AssetStatus;
  barcode?: string | null;
  qrCode?: string | null;
  serialNumber?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  specifications?: Record<string, unknown> | null;
  description?: string;
  code?: string;
  currentValue?: number;
  condition?: string;

  assignedToUserId?: string | null;
  assignedToUser?: User;

  maintenanceLogs?: MaintenanceTask[];

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
  asset?: Asset;
  type: string;
  status: MaintenanceStatus;
  description?: string | null;
  performedBy?: string | null;
  maintenanceDate?: string | null;
  nextScheduled?: string | null;
  cost?: number | null;
  createdAt: string;
  updatedAt?: string;
  technicianId?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  scheduledDate?: string;
  completedDate?: string;
  startDate?: string;
  notes?: string;
}

// Audit Log
// Audit Log
export interface AuditLog {
  id: string;
  userId?: string | null;
  user?: User;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, unknown> | string | null;
  ipAddress?: string | null;
  timestamp: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type?: string | null;
  isRead?: boolean;
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

export type AssignmentStatus = 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'RETURNED' | 'REJECTED';

// Assignment
export interface Assignment {
  id: string;
  assetId: string;
  userId: string;
  asset?: Asset;
  user?: User;
  status: AssignmentStatus;
  assignedAt: string;
  dueDate?: string;
  notes?: string;
}

export interface CreateAssignmentRequest {
  assetId: string;
  userId: string;
  notes?: string;
  dueDate?: string;
  status?: 'ACTIVE' | 'PENDING';
}

export interface CreateAssetRequest {
  name: string;
  description?: string;
  serialNumber?: string;
  barcode?: string;
  qrCode?: string;
  status?: AssetStatus;
  purchaseDate?: string;
  purchasePrice?: number;
  specifications?: any;
  categoryId: string;
  storeId?: string;
  shelfId?: string;
}

export interface UpdateAssetRequest extends Partial<CreateAssetRequest> {
  id: string;
}

export interface CreateAssetCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateAssetCategoryRequest extends Partial<CreateAssetCategoryRequest> {
  id: string;
}

export interface AssetDisposal {
  id: string;
  assetId: string;
  asset?: Asset;
  disposalDate: string;
  reason?: string;
  method?: string;
  value?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetDisposalRequest {
  assetId: string;
  disposalDate?: string;
  reason?: string;
  method?: string;
  value?: number;
}

export interface UpdateAssetDisposalRequest extends Partial<CreateAssetDisposalRequest> {
  id: string;
}

export interface CreateAssetReturnRequest {
  assetId: string;
  returnDate?: string;
  condition?: string;
  notes?: string;
}

export interface UpdateAssetReturnRequest extends Partial<CreateAssetReturnRequest> {
  id: string;
}

export interface CreateAssetTransferRequest {
  assetId: string;
  fromStoreId?: string;
  toStoreId: string;
  transferDate?: string;
  reason?: string;
  status?: string;
}

export interface UpdateAssetTransferRequest extends Partial<CreateAssetTransferRequest> {
  id: string;
}

export interface CreateShelfRequest {
  name: string;
  description?: string;
  storeId: string;
}

export interface UpdateShelfRequest extends Partial<CreateShelfRequest> {
  id: string;
}

export interface CreateMaintenanceRequest {
  assetId: string;
  type: string;
  description?: string;
  performedBy?: string;
  cost?: number;
  maintenanceDate?: string;
  status?: MaintenanceStatus;
  reportedByUserId?: string;
}

export interface UpdateMaintenanceRequest {
  id: string;
  status?: MaintenanceStatus;
  notes?: string; // mapped to description? Or I should add notes to schema?
                   // The form uses "notes". Schema has "description".
                   // I should stick to description.
  performedBy?: string;
  // ... other fields
}
