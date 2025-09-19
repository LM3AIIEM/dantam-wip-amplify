import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface PatientRegistrationProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function PatientRegistration({ onComplete, onCancel }: PatientRegistrationProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  const handleSubmit = () => {
    toast.success('Patient registration completed (simplified demo)');
    onComplete(formData);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-xl font-semibold">Add New Patient</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">First Name</label>
            <Input
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="medical-input"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Last Name</label>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="medical-input"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="medical-input"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="medical-input"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="medical-button-primary flex-1">
              Add Patient
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}