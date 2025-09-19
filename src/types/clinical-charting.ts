export type DentalNotation = 'fdi' | 'universal' | 'palmer';

export type ToothCondition = 
  | 'healthy'
  | 'caries'
  | 'filling'
  | 'crown'
  | 'implant'
  | 'extraction'
  | 'root_canal'
  | 'bridge'
  | 'veneer'
  | 'sealant'
  | 'missing'
  | 'impacted';

export type ToothSurface = 'mesial' | 'distal' | 'occlusal' | 'buccal' | 'lingual' | 'incisal';

export type TreatmentPriority = 'urgent' | 'recommended' | 'optional' | 'completed';

export type TreatmentPhase = 'phase_1' | 'phase_2' | 'phase_3' | 'maintenance';

export interface ToothConditionData {
  toothNumber: string;
  condition: ToothCondition;
  surfaces?: ToothSurface[];
  notes?: string;
  dateRecorded: Date;
  treatedBy: string;
  color: string;
}

export interface TreatmentProcedure {
  id: string;
  code: string;
  name: string;
  description: string;
  estimatedCost: number;
  estimatedDuration: number; // in minutes
  requiresAnesthesia: boolean;
  category: string;
}

export interface TreatmentPlanItem {
  id: string;
  toothNumber?: string;
  procedure: TreatmentProcedure;
  priority: TreatmentPriority;
  phase: TreatmentPhase;
  estimatedCost: number;
  notes?: string;
  alternatives?: TreatmentProcedure[];
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate?: Date;
  completedDate?: Date;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  providerId: string;
  createdDate: Date;
  updatedDate: Date;
  title: string;
  items: TreatmentPlanItem[];
  totalCost: number;
  estimatedDuration: number; // total treatment time in weeks
  status: 'draft' | 'presented' | 'accepted' | 'in_progress' | 'completed';
  patientSignature?: string;
  providerSignature?: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  providerId: string;
  date: Date;
  type: 'examination' | 'treatment' | 'consultation' | 'follow_up' | 'emergency';
  chiefComplaint?: string;
  clinicalFindings: string;
  diagnosis: string;
  treatmentProvided?: string;
  recommendations?: string;
  nextAppointment?: Date;
  attachments?: ClinicalAttachment[];
}

export interface ClinicalAttachment {
  id: string;
  type: 'photo' | 'xray' | 'document' | 'scan';
  filename: string;
  url: string;
  caption?: string;
  annotations?: PhotoAnnotation[];
  capturedDate: Date;
}

export interface PhotoAnnotation {
  id: string;
  type: 'arrow' | 'circle' | 'text' | 'rectangle';
  coordinates: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  text?: string;
  color: string;
}

export interface ToothDiagram {
  id: string;
  type: 'adult' | 'pediatric';
  notation: DentalNotation;
  conditions: ToothConditionData[];
}

export interface TreatmentProgress {
  id: string;
  treatmentPlanItemId: string;
  date: Date;
  progressPercentage: number;
  notes: string;
  providerId: string;
  photos?: ClinicalAttachment[];
  nextSteps?: string;
}

// Dental notation mapping
export const ADULT_TEETH_FDI = [
  // Upper jaw (1x and 2x)
  '18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28',
  // Lower jaw (3x and 4x)
  '48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'
];

export const ADULT_TEETH_UNIVERSAL = [
  // Upper jaw
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16',
  // Lower jaw
  '32', '31', '30', '29', '28', '27', '26', '25', '24', '23', '22', '21', '20', '19', '18', '17'
];

export const PEDIATRIC_TEETH_FDI = [
  // Upper jaw
  '55', '54', '53', '52', '51', '61', '62', '63', '64', '65',
  // Lower jaw
  '85', '84', '83', '82', '81', '71', '72', '73', '74', '75'
];

export const CONDITION_COLORS: Record<ToothCondition, string> = {
  healthy: '#10b981', // green-500
  caries: '#dc2626', // red-600
  filling: '#3b82f6', // blue-500
  crown: '#f59e0b', // amber-500
  implant: '#8b5cf6', // violet-500
  extraction: '#ef4444', // red-500
  root_canal: '#ec4899', // pink-500
  bridge: '#06b6d4', // cyan-500
  veneer: '#84cc16', // lime-500
  sealant: '#6366f1', // indigo-500
  missing: '#6b7280', // gray-500
  impacted: '#f97316', // orange-500
};

export const PRIORITY_COLORS: Record<TreatmentPriority, string> = {
  urgent: '#dc2626', // red-600
  recommended: '#f59e0b', // amber-500
  optional: '#10b981', // green-500
  completed: '#6b7280', // gray-500
};