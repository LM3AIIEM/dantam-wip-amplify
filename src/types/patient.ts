export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  lastVisit: string;
  status: 'active' | 'inactive' | 'pending' | 'discharged';
  insurance: string;
  primaryPhysician: string;
  medicalRecordNumber: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface PatientFilters {
  search: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export type ViewMode = 'table' | 'cards';
export type SortField = 'name' | 'id' | 'lastVisit' | 'status';
export type SortDirection = 'asc' | 'desc';