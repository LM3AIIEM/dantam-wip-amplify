import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Plus, Package, Truck, CheckCircle, Clock, Edit } from 'lucide-react';
import type { PurchaseOrder, OrderStatus } from '@/types/inventory';

export function ReorderManagement() {
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  const reorderAlerts = [
    { id: '1', itemName: 'Composite Resin A2', currentStock: 5, reorderPoint: 10, suggestedQuantity: 20 },
    { id: '2', itemName: 'Local Anesthetic', currentStock: 8, reorderPoint: 15, suggestedQuantity: 30 },
    { id: '3', itemName: 'Impression Material', currentStock: 2, reorderPoint: 5, suggestedQuantity: 15 }
  ];

  const purchaseOrders: PurchaseOrder[] = [
    {
      id: '1',
      orderNumber: 'PO-2024-001',
      vendorId: 'vendor-1',
      orderDate: new Date('2024-01-15'),
      expectedDeliveryDate: new Date('2024-01-25'),
      status: 'ordered',
      items: [],
      subtotal: 1250.00,
      tax: 125.00,
      shippingCost: 25.00,
      totalAmount: 1400.00
    },
    {
      id: '2',
      orderNumber: 'PO-2024-002',
      vendorId: 'vendor-2',
      orderDate: new Date('2024-01-18'),
      expectedDeliveryDate: new Date('2024-01-28'),
      actualDeliveryDate: new Date('2024-01-27'),
      status: 'received',
      items: [],
      subtotal: 850.00,
      tax: 85.00,
      shippingCost: 15.00,
      totalAmount: 950.00
    }
  ];

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'ordered':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'received':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'pending':
        return 'warning';
      case 'ordered':
        return 'default';
      case 'shipped':
        return 'default';
      case 'received':
        return 'success';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Reorder Alerts</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="receiving">Receiving</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Reorder Alerts</CardTitle>
                <CardDescription>Items that need to be reordered</CardDescription>
              </div>
              <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Purchase Order</DialogTitle>
                    <DialogDescription>
                      Create a new purchase order for selected items.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vendor">Vendor</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vendor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vendor-1">Dental Supply Co.</SelectItem>
                            <SelectItem value="vendor-2">Medical Materials Inc.</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delivery">Expected Delivery</Label>
                        <Input id="delivery" type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Items to Order</Label>
                      <div className="border rounded-md p-4 space-y-2 max-h-40 overflow-y-auto">
                        {reorderAlerts.map((alert) => (
                          <div key={alert.id} className="flex items-center justify-between p-2 border rounded">
                            <span className="font-medium">{alert.itemName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Qty:</span>
                              <Input 
                                className="w-20" 
                                type="number" 
                                defaultValue={alert.suggestedQuantity} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" placeholder="Additional notes for the vendor" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsCreateOrderOpen(false)}>
                      Create Order
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Point</TableHead>
                    <TableHead>Suggested Quantity</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reorderAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.itemName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span className="text-destructive font-medium">{alert.currentStock}</span>
                        </div>
                      </TableCell>
                      <TableCell>{alert.reorderPoint}</TableCell>
                      <TableCell className="font-medium">{alert.suggestedQuantity}</TableCell>
                      <TableCell>
                        <Badge variant={alert.currentStock < alert.reorderPoint / 2 ? 'destructive' : 'secondary'}>
                          {alert.currentStock < alert.reorderPoint / 2 ? 'Critical' : 'Medium'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Add to Order
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>Track your purchase orders and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>Dental Supply Co.</TableCell>
                      <TableCell>{order.orderDate.toLocaleDateString()}</TableCell>
                      <TableCell>{order.expectedDeliveryDate.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status) as any} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receiving" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receiving Workflow</CardTitle>
              <CardDescription>Process incoming deliveries and update inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">PO-2024-003</h3>
                      <p className="text-sm text-muted-foreground">Expected: Jan 25, 2024</p>
                    </div>
                    <Badge variant="default">Shipped</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Composite Resin A2</span>
                      <span>Ordered: 20 | Expected: 20</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Disposable Gloves</span>
                      <span>Ordered: 10 | Expected: 10</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    Start Receiving Process
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}