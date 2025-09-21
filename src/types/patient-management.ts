import { z } from 'zod';

// Patient Information Schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Gender is required',
  }),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'ZIP code must be at least 5 digits'),
    country: z.string().default('India'),
  }),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']).optional(),
  occupation: z.string().optional(),
});

// Insurance Information Schema
export const insuranceInfoSchema = z.object({
  hasInsurance: z.boolean(),
  primaryInsurance: z.object({
    provider: z.string().optional(),
    policyNumber: z.string().optional(),
    groupNumber: z.string().optional(),
    subscriberName: z.string().optional(),
    subscriberDOB: z.date().optional(),
    relationship: z.enum(['self', 'spouse', 'child', 'other']).optional(),
  }).optional(),
  secondaryInsurance: z.object({
    provider: z.string().optional(),
    policyNumber: z.string().optional(),
    groupNumber: z.string().optional(),
    subscriberName: z.string().optional(),
    subscriberDOB: z.date().optional(),
    relationship: z.enum(['self', 'spouse', 'child', 'other']).optional(),
  }).optional(),
});

// Medical History Schema
export const medicalHistorySchema = z.object({
  medicalConditions: z.array(z.string()).default([]),
  currentMedications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
  })).default([]),
  allergies: z.array(z.object({
    allergen: z.string(),
    reaction: z.string(),
    severity: z.enum(['mild', 'moderate', 'severe']),
  })).default([]),
  dentalHistory: z.object({
    lastDentalVisit: z.date().optional(),
    lastCleaning: z.date().optional(),
    previousDentist: z.string().optional(),
    reasonForVisit: z.string().optional(),
    dentalConcerns: z.array(z.string()).default([]),
    previousTreatments: z.array(z.string()).default([]),
  }),
  habits: z.object({
    smoking: z.boolean(),
    alcohol: z.boolean(),
    grinding: z.boolean(),
    clenching: z.boolean(),
  }),
});

// Emergency Contact Schema
export const emergencyContactSchema = z.object({
  contacts: z.array(z.object({
    name: z.string().min(1, 'Contact name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    isPrimary: z.boolean(),
  })).min(1, 'At least one emergency contact is required'),
});

// Photo and Consent Schema
export const photoConsentSchema = z.object({
  photo: z.string().optional(), // Base64 encoded photo
  treatmentConsent: z.boolean().refine(val => val === true, {
    message: 'Treatment consent is required',
  }),
  privacyConsent: z.boolean().refine(val => val === true, {
    message: 'Privacy agreement consent is required',
  }),
  hipaaConsent: z.boolean().refine(val => val === true, {
    message: 'HIPAA authorization is required',
  }),
  financialConsent: z.boolean().refine(val => val === true, {
    message: 'Financial policy agreement is required',
  }),
});

// Complete Patient Registration Schema
export const patientRegistrationSchema = z.object({
  personalInfo: personalInfoSchema,
  insuranceInfo: insuranceInfoSchema,
  medicalHistory: medicalHistorySchema,
  emergencyContacts: emergencyContactSchema,
  photoConsent: photoConsentSchema,
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type InsuranceInfo = z.infer<typeof insuranceInfoSchema>;
export type MedicalHistory = z.infer<typeof medicalHistorySchema>;
export type EmergencyContacts = z.infer<typeof emergencyContactSchema>;
export type PhotoConsent = z.infer<typeof photoConsentSchema>;
export type PatientRegistration = z.infer<typeof patientRegistrationSchema>;

// Extended Patient Type for Profile Management
export interface PatientProfile extends Patient {
  personalInfo: PersonalInfo;
  insuranceInfo?: InsuranceInfo;
  medicalHistory?: MedicalHistory;
  emergencyContacts: EmergencyContacts;
  documents: Document[];
  appointments: Appointment[];
  treatments: Treatment[];
  communications: Communication[];
  familyMembers: string[]; // Patient IDs
  photo?: string;
  outstandingBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'other';
  url: string;
  uploadDate: Date;
  category: 'insurance' | 'medical' | 'consent' | 'xray' | 'other';
}

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  type: string;
  provider: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface Treatment {
  id: string;
  date: Date;
  procedure: string;
  tooth?: string;
  provider: string;
  status: 'planned' | 'in-progress' | 'completed';
  cost: number;
  notes?: string;
}

export interface Communication {
  id: string;
  date: Date;
  type: 'call' | 'email' | 'sms' | 'in-person';
  direction: 'incoming' | 'outgoing';
  subject?: string;
  content: string;
  staff: string;
}

// Patient Type update
import { Patient } from './patient';

export * from './patient';