import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
<<<<<<< HEAD
import { toast } from 'sonner';

interface PatientRegistrationProps {
  onComplete: (data: any) => void;
=======
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PatientRegistration as PatientRegistrationType } from '@/types/patient-management';

interface PatientRegistrationProps {
  onComplete: (data: PatientRegistrationType) => void;
>>>>>>> lovable/lovable-working
  onCancel: () => void;
}

export function PatientRegistration({ onComplete, onCancel }: PatientRegistrationProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
<<<<<<< HEAD
  });

  const handleSubmit = () => {
    toast.success('Patient registration completed (simplified demo)');
    onComplete(formData);
=======
    dateOfBirth: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create PatientRegistration object matching the expected type
      const patientData: PatientRegistrationType = {
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date('1990-01-01'),
          gender: 'other' as const,
          phone: formData.phone,
          email: formData.email,
          address: {
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            country: 'India',
          },
        },
        insuranceInfo: {
          hasInsurance: false,
          primaryInsurance: {
            provider: '',
            policyNumber: '',
            groupNumber: '',
            subscriberName: '',
            subscriberDOB: new Date(),
            relationship: 'self',
          },
        },
        medicalHistory: {
          medicalConditions: [],
          currentMedications: [],
          allergies: [],
          dentalHistory: {
            lastDentalVisit: new Date(),
            lastCleaning: new Date(),
            previousDentist: '',
            reasonForVisit: '',
            dentalConcerns: [],
            previousTreatments: [],
          },
          habits: {
            smoking: false,
            alcohol: false,
            grinding: false,
            clenching: false,
          },
        },
        emergencyContacts: {
          contacts: [{
            name: formData.emergencyContactName || 'Emergency Contact',
            relationship: formData.emergencyContactRelationship || 'family',
            phone: formData.emergencyContactPhone || '',
            email: '',
            isPrimary: true,
          }],
        },
        photoConsent: {
          photo: '',
          treatmentConsent: true,
          privacyConsent: true,
          hipaaConsent: true,
          financialConsent: true,
        },
      };

      await onComplete(patientData);
    } catch (error) {
      console.error('Error submitting patient data:', error);
      toast.error('Failed to register patient. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
>>>>>>> lovable/lovable-working
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-xl font-semibold">Add New Patient</h2>
        </CardHeader>
<<<<<<< HEAD
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
=======
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="medical-input"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="medical-input"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="medical-input"
                placeholder="+91 9999999999"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="medical-input"
                placeholder="patient@example.com"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="medical-input"
                disabled={isSubmitting}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3">Emergency Contact</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="emergencyContactName" className="text-sm font-medium">Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
                    className="medical-input"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="emergencyContactPhone" className="text-sm font-medium">Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
                      className="medical-input"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContactRelationship" className="text-sm font-medium">Relationship</Label>
                    <Input
                      id="emergencyContactRelationship"
                      value={formData.emergencyContactRelationship}
                      onChange={(e) => setFormData({...formData, emergencyContactRelationship: e.target.value})}
                      className="medical-input"
                      placeholder="Spouse, Parent, etc."
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="medical-button-primary flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding Patient...' : 'Add Patient'}
              </Button>
            </div>
          </form>
>>>>>>> lovable/lovable-working
        </CardContent>
      </Card>
    </div>
  );
}