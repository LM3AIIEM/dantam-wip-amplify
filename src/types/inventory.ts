export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: ProductCategory;
  sku: string;
  barcode?: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  unitOfMeasure: string;
  unitCost: number;
  totalValue: number;
  location: string;
  expirationDate?: Date;
  lastRestocked: Date;
  vendorId: string;
  isActive: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  deliveryTime: number; // in days
  rating: number;
  isActive: boolean;
  lastOrderDate?: Date;
  totalOrderValue: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  status: OrderStatus;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  notes?: string;
}

export interface PurchaseOrderItem {
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface Equipment {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  purchaseDate: Date;
  purchasePrice: number;
  warrantyExpiration?: Date;
  location: string;
  status: EquipmentStatus;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate: Date;
  maintenanceHistory: MaintenanceRecord[];
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  date: Date;
  type: MaintenanceType;
  description: string;
  cost: number;
  performedBy: string;
  nextDueDate?: Date;
  notes?: string;
}

export interface InventoryAlert {
  id: string;
  type: AlertType;
  itemId: string;
  message: string;
  severity: AlertSeverity;
  createdAt: Date;
  isRead: boolean;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  type: TransactionType;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  date: Date;
  reference?: string;
  notes?: string;
  performedBy: string;
}

export type ProductCategory = 
  | 'restorative_materials'
  | 'preventive_materials'
  | 'surgical_supplies'
  | 'disposables'
  | 'instruments'
  | 'equipment'
  | 'pharmaceuticals'
  | 'impression_materials'
  | 'anesthetics'
  | 'office_supplies';

export type OrderStatus = 
  | 'draft'
  | 'pending'
  | 'ordered'
  | 'shipped'
  | 'received'
  | 'cancelled';

export type EquipmentStatus = 
  | 'operational'
  | 'maintenance_required'
  | 'out_of_service'
  | 'retired';

export type MaintenanceType = 
  | 'preventive'
  | 'repair'
  | 'calibration'
  | 'inspection'
  | 'cleaning';

export type AlertType = 
  | 'low_stock'
  | 'expiring_soon'
  | 'expired'
  | 'reorder_needed'
  | 'maintenance_due'
  | 'warranty_expiring';

export type AlertSeverity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type TransactionType = 
  | 'purchase'
  | 'usage'
  | 'adjustment'
  | 'waste'
  | 'return'
  | 'transfer';

export interface InventoryFilters {
  category?: ProductCategory;
  location?: string;
  vendor?: string;
  lowStock?: boolean;
  expiringSoon?: boolean;
  isActive?: boolean;
}

export interface InventoryReport {
  totalValue: number;
  totalItems: number;
  lowStockItems: number;
  expiringItems: number;
  topCategories: Array<{
    category: ProductCategory;
    value: number;
    percentage: number;
  }>;
  monthlyUsage: Array<{
    month: string;
    usage: number;
    cost: number;
  }>;
}