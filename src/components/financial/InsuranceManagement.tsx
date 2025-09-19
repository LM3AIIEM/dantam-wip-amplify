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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FileText, Shield, AlertCircle, CheckCircle, Plus, Eye } from 'lucide-react';
import { InsuranceClaim, InsuranceProvider } from '@/types/financial';

const mockProviders: InsuranceProvider[] = [
  {
    id: '1',
    name: 'Delta Dental',
    planType: 'PPO',
    deductible: 50,
    annualMaximum: 1500,
    preventiveCoverage: 100,
    basicCoverage: 80,
    majorCoverage: 50,
    ortoCoverage: 50,
    isActive: true
  },
  {
    id: '2',
    name: 'Cigna Dental',
    planType: 'HMO',
    deductible: 25,
    annualMaximum: 1200,
    preventiveCoverage: 100,
    basicCoverage: 70,
    majorCoverage: 50,
    ortoCoverage: 0,
    isActive: true
  }
];

const mockClaims: InsuranceClaim[] = [
  {
    id: '1',
    patientId: 'p1',
    providerId: 'dr1',
    insuranceProvider: mockProviders[0],
    claimDate: '2024-01-15',
    serviceDate: '2024-01-10',
    totalAmount: 350.00,
    approvedAmount: 280.00,
    paidAmount: 280.00,
    status: 'paid'
  },
  {
    id: '2',
    patientId: 'p2',
    providerId: 'dr1',
    insuranceProvider: mockProviders[1],
    claimDate: '2024-01-12',
    serviceDate: '2024-01-08',
    totalAmount: 150.00,
    approvedAmount: 120.00,
    paidAmount: 0,
    status: 'approved'
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'approved': return <CheckCircle className="h-4 w-4 text-blue-600" />;
    case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case 'denied': return <AlertCircle className="h-4 w-4 text-red-600" />;
    default: return <FileText className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800';
    case 'approved': return 'bg-blue-100 text-blue-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'denied': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function InsuranceManagement() {
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Insurance Management</h2>
        <div className="flex gap-2">
          <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Submit Claim
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit Insurance Claim</DialogTitle>
              </DialogHeader>
              <ClaimForm onClose={() => setIsClaimDialogOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={isProviderDialogOpen} onOpenChange={setIsProviderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Provider
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Insurance Provider</DialogTitle>
              </DialogHeader>
              <ProviderForm onClose={() => setIsProviderDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="claims" className="w-full">
        <TabsList>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="providers">Insurance Providers</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Service Date</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClaims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">CLM-{claim.id.padStart(3, '0')}</TableCell>
                      <TableCell>John Smith</TableCell>
                      <TableCell>{claim.insuranceProvider.name}</TableCell>
                      <TableCell>{new Date(claim.serviceDate).toLocaleDateString()}</TableCell>
                      <TableCell>{formatCurrency(claim.totalAmount)}</TableCell>
                      <TableCell>{formatCurrency(claim.approvedAmount)}</TableCell>
                      <TableCell>{formatCurrency(claim.paidAmount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(claim.status)}
                          <Badge className={getStatusColor(claim.status)}>
                            {claim.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockProviders.map((provider) => (
                  <Card key={provider.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <Badge variant={provider.isActive ? 'default' : 'secondary'}>
                          {provider.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Plan Type:</span>
                        <span className="font-medium">{provider.planType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Deductible:</span>
                        <span className="font-medium">{formatCurrency(provider.deductible)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Annual Maximum:</span>
                        <span className="font-medium">{formatCurrency(provider.annualMaximum)}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Preventive:</span>
                          <span>{provider.preventiveCoverage}%</span>
                        </div>
                        <Progress value={provider.preventiveCoverage} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Basic:</span>
                          <span>{provider.basicCoverage}%</span>
                        </div>
                        <Progress value={provider.basicCoverage} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Major:</span>
                          <span>{provider.majorCoverage}%</span>
                        </div>
                        <Progress value={provider.majorCoverage} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="patient">Patient</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="p1">John Smith</SelectItem>
                        <SelectItem value="p2">Jane Doe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="provider">Insurance Provider</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Delta Dental</SelectItem>
                        <SelectItem value="2">Cigna Dental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button>
                      <Shield className="h-4 w-4 mr-2" />
                      Verify Coverage
                    </Button>
                  </div>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Verification Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Plan Details</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Plan Type:</span>
                            <span>PPO</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Member ID:</span>
                            <span>123456789</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Group Number:</span>
                            <span>ABC123</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Effective Date:</span>
                            <span>01/01/2024</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Benefits Used</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Deductible Met:</span>
                            <span>{formatCurrency(25)} / {formatCurrency(50)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Annual Maximum Used:</span>
                            <span>{formatCurrency(450)} / {formatCurrency(1500)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Remaining Benefits:</span>
                            <span className="font-semibold text-green-600">{formatCurrency(1050)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ClaimForm({ onClose }: { onClose: () => void }) {
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
            </SelectContent>
          </Select>
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
        <div>
          <Label htmlFor="serviceDate">Service Date</Label>
          <Input type="date" id="serviceDate" />
        </div>
        <div>
          <Label htmlFor="totalAmount">Total Amount</Label>
          <Input type="number" id="totalAmount" placeholder="350.00" />
        </div>
      </div>

      <div>
        <Label htmlFor="procedures">Procedures</Label>
        <Textarea id="procedures" placeholder="List of procedures performed..." />
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>
          Submit Claim
        </Button>
      </div>
    </div>
  );
}

function ProviderForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Insurance Provider Name</Label>
          <Input id="name" placeholder="Delta Dental" />
        </div>
        <div>
          <Label htmlFor="planType">Plan Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select plan type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ppo">PPO</SelectItem>
              <SelectItem value="hmo">HMO</SelectItem>
              <SelectItem value="indemnity">Indemnity</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="deductible">Deductible</Label>
          <Input type="number" id="deductible" placeholder="50.00" />
        </div>
        <div>
          <Label htmlFor="annualMax">Annual Maximum</Label>
          <Input type="number" id="annualMax" placeholder="1500.00" />
        </div>
        <div>
          <Label htmlFor="preventive">Preventive Coverage (%)</Label>
          <Input type="number" id="preventive" placeholder="100" />
        </div>
        <div>
          <Label htmlFor="basic">Basic Coverage (%)</Label>
          <Input type="number" id="basic" placeholder="80" />
        </div>
        <div>
          <Label htmlFor="major">Major Coverage (%)</Label>
          <Input type="number" id="major" placeholder="50" />
        </div>
        <div>
          <Label htmlFor="ortho">Orthodontic Coverage (%)</Label>
          <Input type="number" id="ortho" placeholder="50" />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>
          Add Provider
        </Button>
      </div>
    </div>
  );
}