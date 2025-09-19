import { Patient } from '@/types/patient';

export const mockPatients: Patient[] = [
  {
    id: 'PT-001',
    name: 'Sarah Johnson',
    phone: '(555) 123-4567',
    email: 'sarah.johnson@email.com',
    dateOfBirth: '1985-03-15',
    lastVisit: '2024-01-15',
    status: 'active',
    insurance: 'Blue Cross Blue Shield',
    primaryPhysician: 'Dr. Michael Chen',
    medicalRecordNumber: 'MRN-789456',
    emergencyContact: {
      name: 'John Johnson',
      phone: '(555) 123-4568',
      relationship: 'Spouse'
    }
  },
  {
    id: 'PT-002',
    name: 'Michael Rodriguez',
    phone: '(555) 234-5678',
    email: 'michael.rodriguez@email.com',
    dateOfBirth: '1978-11-22',
    lastVisit: '2024-01-10',
    status: 'pending',
    insurance: 'Aetna',
    primaryPhysician: 'Dr. Emily Watson',
    medicalRecordNumber: 'MRN-123789',
    emergencyContact: {
      name: 'Maria Rodriguez',
      phone: '(555) 234-5679',
      relationship: 'Wife'
    }
  },
  {
    id: 'PT-003',
    name: 'Jennifer Davis',
    phone: '(555) 345-6789',
    email: 'jennifer.davis@email.com',
    dateOfBirth: '1992-07-08',
    lastVisit: '2023-12-20',
    status: 'active',
    insurance: 'UnitedHealth',
    primaryPhysician: 'Dr. Robert Kim',
    medicalRecordNumber: 'MRN-456123',
    emergencyContact: {
      name: 'David Davis',
      phone: '(555) 345-6780',
      relationship: 'Father'
    }
  },
  {
    id: 'PT-004',
    name: 'Robert Wilson',
    phone: '(555) 456-7890',
    email: 'robert.wilson@email.com',
    dateOfBirth: '1965-09-12',
    lastVisit: '2024-01-08',
    status: 'discharged',
    insurance: 'Medicare',
    primaryPhysician: 'Dr. Lisa Park',
    medicalRecordNumber: 'MRN-654321',
    emergencyContact: {
      name: 'Helen Wilson',
      phone: '(555) 456-7891',
      relationship: 'Wife'
    }
  },
  {
    id: 'PT-005',
    name: 'Amanda Thompson',
    phone: '(555) 567-8901',
    email: 'amanda.thompson@email.com',
    dateOfBirth: '1990-12-03',
    lastVisit: '2024-01-12',
    status: 'active',
    insurance: 'Cigna',
    primaryPhysician: 'Dr. James Lee',
    medicalRecordNumber: 'MRN-987654',
    emergencyContact: {
      name: 'Robert Thompson',
      phone: '(555) 567-8902',
      relationship: 'Brother'
    }
  },
  {
    id: 'PT-006',
    name: 'Christopher Brown',
    phone: '(555) 678-9012',
    email: 'christopher.brown@email.com',
    dateOfBirth: '1988-04-17',
    lastVisit: '2023-11-25',
    status: 'inactive',
    insurance: 'Kaiser Permanente',
    primaryPhysician: 'Dr. Sarah Johnson',
    medicalRecordNumber: 'MRN-147852',
    emergencyContact: {
      name: 'Lisa Brown',
      phone: '(555) 678-9013',
      relationship: 'Sister'
    }
  }
];