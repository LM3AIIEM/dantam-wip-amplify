import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Plus, Search, Phone, Mail, MapPin, Star, TrendingUp, Edit, Trash2 } from 'lucide-react';
import type { Vendor } from '@/types/inventory';

export function VendorManagement() {
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const vendors: Vendor[] = [
    {
      id: '1',
      name: 'Dental Supply Co.',
      contactPerson: 'John Smith',
      email: 'orders@dentalsupply.com',
      phone: '(555) 123-4567',
      address: '123 Medical Way, City, ST 12345',
      paymentTerms: 'Net 30',
      deliveryTime: 5,
      rating: 4.8,
      isActive: true,
      lastOrderDate: new Date('2024-01-15'),
      totalOrderValue: 25000
    },
    {
      id: '2',
      name: 'Medical Materials Inc.',
      contactPerson: 'Sarah Johnson',
      email: 'sales@medmaterials.com',
      phone: '(555) 987-6543',
      address: '456 Supply Street, City, ST 54321',
      paymentTerms: 'Net 15',
      deliveryTime: 3,
      rating: 4.5,
      isActive: true,
      lastOrderDate: new Date('2024-01-20'),
      totalOrderValue: 18500
    }
  ];

  const vendorPerformance = [
    { vendor: 'Dental Supply Co.', onTimeDelivery: 95, qualityRating: 4.8, costEfficiency: 4.2 },
    { vendor: 'Medical Materials Inc.', onTimeDelivery: 88, qualityRating: 4.5, costEfficiency: 4.6 }
  ];

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="vendors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Dialog open={isAddVendorOpen} onOpenChange={setIsAddVendorOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vendor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Vendor</DialogTitle>
                  <DialogDescription>
                    Enter the vendor information and contact details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor-name">Vendor Name</Label>
                    <Input id="vendor-name" placeholder="Enter vendor name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-person">Contact Person</Label>
                    <Input id="contact-person" placeholder="Enter contact name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="vendor@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="(555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-terms">Payment Terms</Label>
                    <Input id="payment-terms" placeholder="e.g., Net 30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-time">Delivery Time (days)</Label>
                    <Input id="delivery-time" type="number" placeholder="5" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="Enter full address" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddVendorOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddVendorOpen(false)}>
                    Add Vendor
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vendor Directory</CardTitle>
              <CardDescription>Manage your supplier relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Delivery Time</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{vendor.address.split(',')[1]}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{vendor.contactPerson}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{vendor.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{vendor.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{vendor.paymentTerms}</TableCell>
                      <TableCell>{vendor.deliveryTime} days</TableCell>
                      <TableCell>{renderStars(vendor.rating)}</TableCell>
                      <TableCell className="font-medium">${vendor.totalOrderValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={vendor.isActive ? 'default' : 'secondary'}>
                          {vendor.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance Metrics</CardTitle>
              <CardDescription>Track and compare vendor performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {vendorPerformance.map((vendor, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">{vendor.vendor}</h3>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-sm text-success">Improving</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>On-Time Delivery</span>
                          <span className="font-medium">{vendor.onTimeDelivery}%</span>
                        </div>
                        <Progress value={vendor.onTimeDelivery} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Quality Rating</span>
                          <span className="font-medium">{vendor.qualityRating}/5</span>
                        </div>
                        <Progress value={vendor.qualityRating * 20} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Cost Efficiency</span>
                          <span className="font-medium">{vendor.costEfficiency}/5</span>
                        </div>
                        <Progress value={vendor.costEfficiency * 20} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Management</CardTitle>
              <CardDescription>Track vendor contracts and renewal dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Contract management features coming soon</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contract
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}