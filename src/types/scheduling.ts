// Scheduling System Types for DANTAM Healthcare System

export type ProviderType = 'dentist' | 'hygienist' | 'specialist' | 'assistant';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type AppointmentType = 'consultation' | 'cleaning' | 'filling' | 'extraction' | 'root_canal' | 'crown' | 'checkup' | 'emergency';
export type ResourceType = 'chair' | 'operatory' | 'equipment' | 'room';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Provider {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  provider_type: ProviderType;
  specialization?: string;
  license_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProviderSchedule {
  id: string;
  provider_id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  break_start_time?: string;
  break_end_time?: string;
  is_available: boolean;
  created_at: string;
}

export interface Resource {
  id: string;
  name: string;
  resource_type: ResourceType;
  description?: string;
  is_available: boolean;
  maintenance_schedule?: any;
  created_at: string;
  updated_at: string;
}

export interface AppointmentTypeConfig {
  id: string;
  name: string;
  appointment_type: AppointmentType;
  duration_minutes: number;
  color: string;
  description?: string;
  requires_resources?: string[];
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  provider_id: string;
  appointment_type_id: string;
  resource_id?: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes?: string;
  is_recurring: boolean;
  recurring_pattern?: any;
  created_by?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  provider?: Provider;
  appointment_type?: AppointmentTypeConfig;
  resource?: Resource;
  patient?: any; // From patients table
}

export interface WaitListEntry {
  id: string;
  patient_id: string;
  provider_id?: string;
  appointment_type_id: string;
  preferred_date?: string;
  preferred_time_start?: string;
  preferred_time_end?: string;
  priority: number;
  notes?: string;
  is_notified: boolean;
  created_at: string;
  expires_at?: string;
  
  // Joined data
  provider?: Provider;
  appointment_type?: AppointmentTypeConfig;
  patient?: any;
}

export interface ProviderTimeOff {
  id: string;
  provider_id: string;
  start_time: string;
  end_time: string;
  reason?: string;
  is_recurring: boolean;
  recurring_pattern?: any;
  created_at: string;
  
  // Joined data
  provider?: Provider;
}

// Calendar Event interface for FullCalendar
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    appointment?: Appointment;
    provider?: Provider;
    patient?: any;
    type: 'appointment' | 'time_off' | 'break';
  };
}

// Scheduling form interfaces
export interface AppointmentFormData {
  patient_id: string;
  provider_id: string;
  appointment_type_id: string;
  resource_id?: string;
  start_time: string;
  duration_minutes: number;
  notes?: string;
  is_recurring: boolean;
}

export interface AvailabilitySlot {
  start_time: string;
  end_time: string;
  provider_id: string;
  resource_id?: string;
  is_available: boolean;
}

export interface ConflictResolution {
  conflicting_appointments: Appointment[];
  suggested_alternatives: AvailabilitySlot[];
  can_reschedule: boolean;
}