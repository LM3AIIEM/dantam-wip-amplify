import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Search, Wrench, AlertTriangle, CheckCircle, Clock, Edit } from 'lucide-react';
import { format } from 'date-fns';
import type { Equipment, MaintenanceRecord, EquipmentStatus, MaintenanceType } from '@/types/inventory';

export function EquipmentMaintenance() {
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();

  const equipment: Equipment[] = [
    {
      id: '1',
      name: 'Digital X-Ray Unit',
      model: 'DXR-2000',
      manufacturer: 'Dental Tech Corp',
      serialNumber: 'DXR20001234',
      purchaseDate: new Date('2023-01-15'),
      purchasePrice: 25000,
      warrantyExpiration: new Date('2025-01-15'),
      location: 'Operatory 1',
      status: 'operational',
      lastMaintenanceDate: new Date('2024-01-01'),
      nextMaintenanceDate: new Date('2024-04-01'),
      maintenanceHistory: []
    },
    {
      id: '2',
      name: 'Ultrasonic Scaler',
      model: 'US-500',
      manufacturer: 'CleanTech',
      serialNumber: 'US5000567',
      purchaseDate: new Date('2022-06-10'),
      purchasePrice: 3500,
      warrantyExpiration: new Date('2024-06-10'),
      location: 'Hygiene Room',
      status: 'maintenance_required',
      lastMaintenanceDate: new Date('2023-12-15'),
      nextMaintenanceDate: new Date('2024-01-25'),
      maintenanceHistory: []
    }
  ];

  const maintenanceRecords: MaintenanceRecord[] = [
    {
      id: '1',
      equipmentId: '1',
      date: new Date('2024-01-01'),
      type: 'preventive',
      description: 'Routine calibration and cleaning',
      cost: 150,
      performedBy: 'TechService Inc.',
      nextDueDate: new Date('2024-04-01'),
      notes: 'All systems operating normally'
    }
  ];

  const getStatusIcon = (status: EquipmentStatus) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'maintenance_required':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'out_of_service':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'retired':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: EquipmentStatus) => {
    switch (status) {
      case 'operational':
        return 'success';
      case 'maintenance_required':
        return 'warning';
      case 'out_of_service':
        return 'destructive';
      case 'retired':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const isMaintenanceOverdue = (date: Date) => {
    return date < new Date();
  };

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Wrench className="mr-2 h-4 w-4" />
                Log Maintenance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Log Maintenance Record</DialogTitle>
                <DialogDescription>
                  Record maintenance activities and schedule next service.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipment-select">Equipment</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipment.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} - {item.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenance-type">Maintenance Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventive">Preventive</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="calibration">Calibration</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Service Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input id="cost" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="performed-by">Performed By</Label>
                  <Input id="performed-by" placeholder="Service provider name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="next-due">Next Service Due</Label>
                  <Input id="next-due" type="date" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the maintenance work performed" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional notes or observations" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsMaintenanceDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsMaintenanceDialogOpen(false)}>
                  Save Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddEquipmentOpen} onOpenChange={setIsAddEquipmentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
                <DialogDescription>
                  Register new equipment for maintenance tracking.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipment-name">Equipment Name</Label>
                  <Input id="equipment-name" placeholder="Enter equipment name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" placeholder="Enter model number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" placeholder="Enter manufacturer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serial">Serial Number</Label>
                  <Input id="serial" placeholder="Enter serial number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase-date">Purchase Date</Label>
                  <Input id="purchase-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase-price">Purchase Price</Label>
                  <Input id="purchase-price" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warranty">Warranty Expiration</Label>
                  <Input id="warranty" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g., Operatory 1" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddEquipmentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddEquipmentOpen(false)}>
                  Add Equipment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Equipment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Inventory</CardTitle>
          <CardDescription>Manage equipment and track maintenance schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead>Next Maintenance</TableHead>
                <TableHead>Warranty</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((item) => {
                const overdue = isMaintenanceOverdue(item.nextMaintenanceDate);
                const warrantyExpiring = item.warrantyExpiration && 
                  item.warrantyExpiration <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.manufacturer} - {item.model}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.serialNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(item.status) as any} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(item.status)}
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.lastMaintenanceDate ? 
                        item.lastMaintenanceDate.toLocaleDateString() : 
                        'No records'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={overdue ? 'text-destructive font-medium' : ''}>
                          {item.nextMaintenanceDate.toLocaleDateString()}
                        </span>
                        {overdue && <AlertTriangle className="h-4 w-4 text-destructive" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.warrantyExpiration ? (
                          <>
                            <span className={warrantyExpiring ? 'text-warning' : ''}>
                              {item.warrantyExpiration.toLocaleDateString()}
                            </span>
                            {warrantyExpiring && <AlertTriangle className="h-4 w-4 text-warning" />}
                          </>
                        ) : (
                          'No warranty'
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Wrench className="h-3 w-3" />
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

      {/* Maintenance Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedule</CardTitle>
          <CardDescription>Upcoming maintenance and service requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {equipment
              .filter(item => isMaintenanceOverdue(item.nextMaintenanceDate) || 
                            item.nextMaintenanceDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      isMaintenanceOverdue(item.nextMaintenanceDate) ? 'bg-destructive' : 'bg-warning'
                    }`} />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {item.nextMaintenanceDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button size="sm">
                    Schedule Service
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}