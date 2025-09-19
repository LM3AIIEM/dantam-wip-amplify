import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InventoryDashboard } from '@/components/inventory/InventoryDashboard';
import { InventoryTracking } from '@/components/inventory/InventoryTracking';
import { ReorderManagement } from '@/components/inventory/ReorderManagement';
import { VendorManagement } from '@/components/inventory/VendorManagement';
import { EquipmentMaintenance } from '@/components/inventory/EquipmentMaintenance';
import { InventoryAnalytics } from '@/components/inventory/InventoryAnalytics';

export default function InventoryPage() {
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Inventory Management", isCurrentPage: true }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
        </div>
        
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tracking">Inventory</TabsTrigger>
            <TabsTrigger value="reorder">Reorders</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <InventoryDashboard
              totalValue={100000}
              totalItems={1250}
              lowStockItems={8}
              expiringItems={5}
              pendingOrders={3}
              maintenanceDue={2}
            />
          </TabsContent>
          
          <TabsContent value="tracking" className="space-y-4">
            <InventoryTracking />
          </TabsContent>
          
          <TabsContent value="reorder" className="space-y-4">
            <ReorderManagement />
          </TabsContent>
          
          <TabsContent value="vendors" className="space-y-4">
            <VendorManagement />
          </TabsContent>
          
          <TabsContent value="equipment" className="space-y-4">
            <EquipmentMaintenance />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <InventoryAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}