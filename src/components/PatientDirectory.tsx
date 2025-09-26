import React, { useState } from 'react';
import { Search, Filter, Download, MessageSquare, UserPlus, MoreHorizontal, Grid, List } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatientCard } from './PatientCard';
import { PatientTable } from './PatientTable';
import { PatientFilters } from './PatientFilters';
import { FloatingActionButton } from './FloatingActionButton';
import { PatientRegistration } from './patient/PatientRegistration';
import { PatientProfileView } from './patient/PatientProfileView';
import { Patient } from '@/types/patient';
import { type PatientRegistration as PatientRegistrationType, PatientProfile } from '@/types/patient-management';
import { toast } from 'sonner';
import { usePatients } from '@/hooks/usePatients';

interface PatientFilters {
  search: string;
  status: string;
  dateRange: { start: string; end: string };
}

export function PatientDirectory() {
  const { patients, loading, createPatient } = usePatients();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [filters, setFilters] = useState<PatientFilters>({
    search: '',
    status: '',
    dateRange: { start: '', end: '' }
  });
  const [showRegistration, setShowRegistration] = useState(false);
  const [selectedPatientProfile, setSelectedPatientProfile] = useState<PatientProfile | null>(null);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = !filters.search || 
      patient.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      patient.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      patient.phone.includes(filters.search);
    
    const matchesStatus = !filters.status || patient.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddPatient = () => {
    setShowRegistration(true);
  };

  const handleRegistrationComplete = async (data: PatientRegistrationType) => {
    try {
      await createPatient(data);
      setShowRegistration(false);
      // Success toast is already handled in the createPatient function
    } catch (error) {
      console.error('Error creating patient:', error);
      // Error toast is already handled in the createPatient function
    }
  };

  const handlePatientClick = (patient: Patient) => {
    const patientProfile: PatientProfile = {
      ...patient,
      personalInfo: {
        firstName: patient.name.split(' ')[0],
        lastName: patient.name.split(' ').slice(1).join(' ') || '',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'male' as const,
        phone: patient.phone,
        email: patient.email,
        address: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India',
        },
      },
      emergencyContacts: {
        contacts: [{
          name: 'Emergency Contact',
          relationship: 'Family',
          phone: '+91 9999999999',
          email: '',
          isPrimary: true,
        }],
      },
      documents: [],
      appointments: [],
      treatments: [],
      communications: [],
      familyMembers: [],
      outstandingBalance: 1500,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSelectedPatientProfile(patientProfile);
  };

  if (selectedPatientProfile) {
    return (
      <PatientProfileView
        patient={selectedPatientProfile}
        onEdit={() => console.log('Edit patient')}
        onScheduleAppointment={() => console.log('Schedule appointment')}
        onSendMessage={() => console.log('Send message')}
        onClose={() => setSelectedPatientProfile(null)}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Patient Directory</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all patient records in your healthcare system
          </p>
        </div>
        
        <Button 
          onClick={handleAddPatient}
          className="medical-button-primary flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="patient-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-sm text-muted-foreground">Total Patients</p>
          </CardContent>
        </Card>
        
        <Card className="patient-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">
              {patients.filter(p => p.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        
        <Card className="patient-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">
              {patients.filter(p => p.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        
        <Card className="patient-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">12</div>
            <p className="text-sm text-muted-foreground">New This Week</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <PatientFilters
        filters={filters}
        onFiltersChange={setFilters}
        selectedCount={selectedPatients.length}
        onBulkAction={(action) => console.log('Bulk action:', action)}
      />

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'cards')}>
          <TabsList>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Table
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Cards
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Badge variant="outline">
          {filteredPatients.length} patients
        </Badge>
      </div>

      {/* Patient List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading patients...</div>
        </div>
      ) : (
        <Tabs value={viewMode}>
          <TabsContent value="table">
            <PatientTable 
              patients={filteredPatients} 
              onPatientClick={handlePatientClick}
            />
          </TabsContent>
          <TabsContent value="cards" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPatients.map((patient) => (
                <PatientCard 
                  key={patient.id} 
                  patient={patient} 
                  onClick={() => handlePatientClick(patient)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Registration Modal */}
      {showRegistration && (
        <PatientRegistration
          onComplete={handleRegistrationComplete}
          onCancel={() => setShowRegistration(false)}
        />
      )}

      <FloatingActionButton onClick={handleAddPatient} />
    </div>
  );
}
