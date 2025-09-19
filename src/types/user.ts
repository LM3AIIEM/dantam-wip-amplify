// User and Role Management Types for DANTAM Healthcare System

export type UserRole = 'super_admin' | 'clinic_admin' | 'doctor' | 'hygienist' | 'receptionist';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  clinicId?: string;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  timezone: string;
  logo?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  selectedClinic: Clinic | null;
  availableClinics: Clinic[];
}

export interface Permission {
  action: string;
  resource: string;
  conditions?: Record<string, any>;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    { action: '*', resource: '*' }, // Full access
  ],
  clinic_admin: [
    { action: '*', resource: 'clinic', conditions: { clinicId: 'own' } },
    { action: 'read|create|update', resource: 'patient' },
    { action: 'read|create|update', resource: 'appointment' },
    { action: 'read|create|update', resource: 'billing' },
    { action: 'read|create|update', resource: 'staff' },
    { action: 'read', resource: 'analytics' },
  ],
  doctor: [
    { action: 'read|create|update', resource: 'patient' },
    { action: 'read|create|update', resource: 'appointment' },
    { action: 'read|create|update', resource: 'clinical_chart' },
    { action: 'read', resource: 'billing' },
    { action: 'read', resource: 'inventory' },
  ],
  hygienist: [
    { action: 'read|update', resource: 'patient' },
    { action: 'read|create|update', resource: 'appointment' },
    { action: 'read|update', resource: 'clinical_chart' },
    { action: 'read', resource: 'inventory' },
  ],
  receptionist: [
    { action: 'read|create|update', resource: 'patient' },
    { action: 'read|create|update', resource: 'appointment' },
    { action: 'read|create|update', resource: 'billing' },
    { action: 'read|create', resource: 'communication' },
  ],
};