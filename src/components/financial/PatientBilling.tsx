import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Send, FileText, CreditCard } from 'lucide-react';
import { PatientBill, TreatmentCharge } from '@/types/financial';
import { useFinancial } from '@/hooks/useFinancial';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800';
    case 'partial': return 'bg-yellow-100 text-yellow-800';
    case 'overdue': return 'bg-red-100 text-red-800';
    case 'sent': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function PatientBilling() {
  const { bills, loading } = useFinancial();
  const [selectedBill, setSelectedBill] = useState<PatientBill | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading bills...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patient Billing</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Bill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Bill</DialogTitle>
            </DialogHeader>
            <CreateBillForm onClose={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Bill Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.patientName}</TableCell>
                  <TableCell>{new Date(bill.billDate).toLocaleDateString()}</TableCell>
                  <TableCell>{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{formatCurrency(bill.totalAmount)}</TableCell>
                  <TableCell>{formatCurrency(bill.paidAmount)}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(bill.balanceAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(bill.status)}>
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function CreateBillForm({ onClose }: { onClose: () => void }) {
  const [charges, setCharges] = useState<TreatmentCharge[]>([]);

  const addCharge = () => {
    const newCharge: TreatmentCharge = {
      id: Date.now().toString(),
      treatmentCode: '',
      treatmentName: '',
      providerFee: 0,
      insuranceCoverage: 0,
      patientPortion: 0,
      quantity: 1,
      total: 0
    };
    setCharges([...charges, newCharge]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patient">Patient</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p1">John Smith</SelectItem>
              <SelectItem value="p2">Jane Doe</SelectItem>
              <SelectItem value="p3">Mike Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="billDate">Bill Date</Label>
          <Input type="date" id="billDate" />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input type="date" id="dueDate" />
        </div>
        <div>
          <Label htmlFor="provider">Provider</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dr1">Dr. Smith</SelectItem>
              <SelectItem value="dr2">Dr. Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Treatment Charges</h3>
          <Button onClick={addCharge} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Charge
          </Button>
        </div>

        <div className="space-y-4">
          {charges.map((charge, index) => (
            <Card key={charge.id}>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <Label>Treatment Code</Label>
                    <Input placeholder="D0150" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Treatment Name</Label>
                    <Input placeholder="Comprehensive Oral Evaluation" />
                  </div>
                  <div>
                    <Label>Fee</Label>
                    <Input type="number" placeholder="150.00" />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input type="number" placeholder="1" />
                  </div>
                  <div>
                    <Label>Total</Label>
                    <Input type="number" placeholder="150.00" readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Additional notes..." />
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>
          Create Bill
        </Button>
      </div>
    </div>
  );
}