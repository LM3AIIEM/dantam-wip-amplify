import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Package, AlertTriangle, Calendar, QrCode, Edit, Trash2 } from 'lucide-react';
import type { InventoryItem, ProductCategory } from '@/types/inventory';

export function InventoryTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Composite Resin A2',
      description: 'Light-cured composite resin, shade A2',
      category: 'restorative_materials',
      sku: 'CR-A2-001',
      barcode: '1234567890123',
      currentStock: 5,
      reorderPoint: 10,
      maxStock: 50,
      unitOfMeasure: 'tube',
      unitCost: 45.00,
      totalValue: 225.00,
      location: 'Storage A',
      expirationDate: new Date('2025-06-15'),
      lastRestocked: new Date('2024-01-15'),
      vendorId: 'vendor-1',
      isActive: true
    },
    {
      id: '2',
      name: 'Disposable Gloves (M)',
      description: 'Nitrile examination gloves, size medium',
      category: 'disposables',
      sku: 'GLV-M-001',
      currentStock: 200,
      reorderPoint: 100,
      maxStock: 1000,
      unitOfMeasure: 'box',
      unitCost: 12.00,
      totalValue: 2400.00,
      location: 'Storage B',
      lastRestocked: new Date('2024-01-20'),
      vendorId: 'vendor-2',
      isActive: true
    }
  ];

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.reorderPoint) {
      return { status: 'low', color: 'destructive' };
    }
    if (item.currentStock <= item.reorderPoint * 1.5) {
      return { status: 'medium', color: 'warning' };
    }
    return { status: 'good', color: 'success' };
  };

  const isExpiringSoon = (date?: Date) => {
    if (!date) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return date <= thirtyDaysFromNow;
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ProductCategory | 'all')}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="restorative_materials">Restorative Materials</SelectItem>
              <SelectItem value="disposables">Disposables</SelectItem>
              <SelectItem value="instruments">Instruments</SelectItem>
              <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <QrCode className="mr-2 h-4 w-4" />
            Scan Barcode
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
                <DialogDescription>
                  Enter the details for the new inventory item.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input id="name" placeholder="Enter item name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="Enter SKU" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restorative_materials">Restorative Materials</SelectItem>
                      <SelectItem value="disposables">Disposables</SelectItem>
                      <SelectItem value="instruments">Instruments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit of Measure</Label>
                  <Input id="unit" placeholder="e.g., tube, box, each" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Unit Cost</Label>
                  <Input id="cost" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorder">Reorder Point</Label>
                  <Input id="reorder" type="number" placeholder="0" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter item description" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            Manage your dental practice inventory with real-time stock levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item);
                const expiring = isExpiringSoon(item.expirationDate);
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        {expiring && (
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3 text-warning" />
                            <span className="text-xs text-warning">Expires soon</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{item.sku}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {item.category.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.currentStock}</span>
                        <span className="text-muted-foreground">/ {item.maxStock}</span>
                        <span className="text-muted-foreground">{item.unitOfMeasure}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.color as any}>
                        {stockStatus.status === 'low' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {stockStatus.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">${item.totalValue.toFixed(2)}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}