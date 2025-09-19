import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem, Vendor, InventoryReport } from '@/types/inventory';
import { toast } from '@/hooks/use-toast';

export function useInventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);

  const loadInventoryItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      const formattedItems = data?.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category as any,
        sku: item.sku,
        barcode: item.barcode,
        currentStock: item.current_stock,
        reorderPoint: item.reorder_point,
        maxStock: item.max_stock,
        unitOfMeasure: item.unit_of_measure,
        unitCost: typeof item.unit_cost === 'number' ? item.unit_cost : parseFloat(item.unit_cost || '0'),
        totalValue: typeof item.total_value === 'number' ? item.total_value : parseFloat(item.total_value || '0'),
        location: item.location || '',
        expirationDate: item.expiration_date ? new Date(item.expiration_date) : undefined,
        lastRestocked: new Date(item.last_restocked || item.created_at),
        vendorId: item.vendor_id || '',
        isActive: item.is_active
      })) || [];

      setInventoryItems(formattedItems);
    } catch (error) {
      console.error('Error loading inventory items:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      const formattedVendors = data?.map(vendor => ({
        id: vendor.id,
        name: vendor.name,
        contactPerson: vendor.contact_person || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        address: vendor.address || '',
        paymentTerms: vendor.payment_terms || '',
        deliveryTime: vendor.delivery_time || 7,
        rating: typeof vendor.rating === 'number' ? vendor.rating : parseFloat(vendor.rating || '0'),
        isActive: vendor.is_active,
        lastOrderDate: vendor.last_order_date ? new Date(vendor.last_order_date) : undefined,
        totalOrderValue: typeof vendor.total_order_value === 'number' ? vendor.total_order_value : parseFloat(vendor.total_order_value || '0')
      })) || [];

      setVendors(formattedVendors);
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive"
      });
    }
  };

  const createInventoryItem = async (itemData: Omit<InventoryItem, 'id'>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('inventory_items')
        .insert({
          name: itemData.name,
          description: itemData.description,
          category: itemData.category,
          sku: itemData.sku,
          barcode: itemData.barcode,
          current_stock: itemData.currentStock,
          reorder_point: itemData.reorderPoint,
          max_stock: itemData.maxStock,
          unit_of_measure: itemData.unitOfMeasure,
          unit_cost: itemData.unitCost,
          total_value: itemData.totalValue,
          location: itemData.location,
          expiration_date: itemData.expirationDate?.toISOString().split('T')[0],
          vendor_id: itemData.vendorId,
          is_active: itemData.isActive
        });

      if (error) throw error;
      
      await loadInventoryItems();
      
      toast({
        title: "Success",
        description: "Inventory item created successfully"
      });
    } catch (error) {
      console.error('Error creating inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to create inventory item",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('inventory_items')
        .update({
          name: updates.name,
          description: updates.description,
          category: updates.category,
          current_stock: updates.currentStock,
          reorder_point: updates.reorderPoint,
          max_stock: updates.maxStock,
          unit_cost: updates.unitCost,
          total_value: updates.totalValue,
          location: updates.location,
          expiration_date: updates.expirationDate?.toISOString().split('T')[0],
          vendor_id: updates.vendorId,
          is_active: updates.isActive
        })
        .eq('id', id);

      if (error) throw error;
      
      await loadInventoryItems();
      
      toast({
        title: "Success",
        description: "Inventory item updated successfully"
      });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to update inventory item",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createVendor = async (vendorData: Omit<Vendor, 'id'>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('vendors')
        .insert({
          name: vendorData.name,
          contact_person: vendorData.contactPerson,
          email: vendorData.email,
          phone: vendorData.phone,
          address: vendorData.address,
          payment_terms: vendorData.paymentTerms,
          delivery_time: vendorData.deliveryTime,
          rating: vendorData.rating,
          is_active: vendorData.isActive
        });

      if (error) throw error;
      
      await loadVendors();
      
      toast({
        title: "Success",
        description: "Vendor created successfully"
      });
    } catch (error) {
      console.error('Error creating vendor:', error);
      toast({
        title: "Error",
        description: "Failed to create vendor",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getInventoryReport = async (): Promise<InventoryReport> => {
    try {
      const totalValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
      const totalItems = inventoryItems.length;
      const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.reorderPoint).length;
      const expiringItems = inventoryItems.filter(item => {
        if (!item.expirationDate) return false;
        const daysUntilExpiry = Math.ceil((item.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30;
      }).length;

      // Calculate top categories
      const categoryTotals = inventoryItems.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.totalValue;
        return acc;
      }, {} as Record<string, number>);

      const topCategories = Object.entries(categoryTotals)
        .map(([category, value]) => ({
          category: category as any,
          value,
          percentage: Math.round((value / totalValue) * 100)
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      return {
        totalValue,
        totalItems,
        lowStockItems,
        expiringItems,
        topCategories,
        monthlyUsage: [] // This would require transaction history
      };
    } catch (error) {
      console.error('Error generating inventory report:', error);
      return {
        totalValue: 0,
        totalItems: 0,
        lowStockItems: 0,
        expiringItems: 0,
        topCategories: [],
        monthlyUsage: []
      };
    }
  };

  useEffect(() => {
    loadInventoryItems();
    loadVendors();

    // Set up real-time subscriptions
    const inventoryChannel = supabase
      .channel('inventory-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'inventory_items'
      }, () => {
        loadInventoryItems();
      })
      .subscribe();

    const vendorsChannel = supabase
      .channel('vendors-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'vendors'
      }, () => {
        loadVendors();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(vendorsChannel);
    };
  }, []);

  return {
    inventoryItems,
    vendors,
    loading,
    createInventoryItem,
    updateInventoryItem,
    createVendor,
    loadInventoryItems,
    loadVendors,
    getInventoryReport
  };
}