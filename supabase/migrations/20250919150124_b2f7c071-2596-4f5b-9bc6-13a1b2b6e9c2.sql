-- Create enum types for the scheduling system
CREATE TYPE provider_type AS ENUM ('dentist', 'hygienist', 'specialist', 'assistant');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE appointment_type AS ENUM ('consultation', 'cleaning', 'filling', 'extraction', 'root_canal', 'crown', 'checkup', 'emergency');
CREATE TYPE resource_type AS ENUM ('chair', 'operatory', 'equipment', 'room');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- Providers table
CREATE TABLE public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  provider_type provider_type NOT NULL DEFAULT 'dentist',
  specialization TEXT,
  license_number TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Provider availability settings
CREATE TABLE public.provider_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  day_of_week day_of_week NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_start_time TIME,
  break_end_time TIME,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(provider_id, day_of_week)
);

-- Resources (chairs, equipment, rooms)
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  resource_type resource_type NOT NULL,
  description TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  maintenance_schedule JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Appointment types configuration
CREATE TABLE public.appointment_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  appointment_type appointment_type NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  description TEXT,
  requires_resources TEXT[], -- Array of resource IDs or types required
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Main appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  provider_id UUID NOT NULL REFERENCES public.providers(id),
  appointment_type_id UUID NOT NULL REFERENCES public.appointment_types(id),
  resource_id UUID REFERENCES public.resources(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurring_pattern JSONB, -- Pattern for recurring appointments
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Wait list for fully booked slots
CREATE TABLE public.wait_list (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  provider_id UUID REFERENCES public.providers(id),
  appointment_type_id UUID NOT NULL REFERENCES public.appointment_types(id),
  preferred_date DATE,
  preferred_time_start TIME,
  preferred_time_end TIME,
  priority INTEGER NOT NULL DEFAULT 1, -- 1=low, 5=urgent
  notes TEXT,
  is_notified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Provider time off/unavailability
CREATE TABLE public.provider_time_off (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurring_pattern JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wait_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_time_off ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all access for now - to be refined with authentication)
CREATE POLICY "Allow all operations on providers" ON public.providers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on provider_schedules" ON public.provider_schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on resources" ON public.resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on appointment_types" ON public.appointment_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on wait_list" ON public.wait_list FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on provider_time_off" ON public.provider_time_off FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_appointments_provider_time ON public.appointments(provider_id, start_time, end_time);
CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_provider_schedules_provider ON public.provider_schedules(provider_id);
CREATE INDEX idx_wait_list_provider_date ON public.wait_list(provider_id, preferred_date);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_providers_updated_at
  BEFORE UPDATE ON public.providers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.providers (name, email, provider_type, specialization) VALUES
  ('Dr. Sarah Johnson', 'sarah.johnson@dantam.com', 'dentist', 'General Dentistry'),
  ('Dr. Michael Chen', 'michael.chen@dantam.com', 'dentist', 'Orthodontics'),
  ('Lisa Rodriguez', 'lisa.rodriguez@dantam.com', 'hygienist', 'Preventive Care'),
  ('Dr. Emily Davis', 'emily.davis@dantam.com', 'specialist', 'Endodontics');

INSERT INTO public.resources (name, resource_type, description) VALUES
  ('Chair 1', 'chair', 'Main treatment chair in operatory 1'),
  ('Chair 2', 'chair', 'Treatment chair in operatory 2'),
  ('Chair 3', 'chair', 'Treatment chair in operatory 3'),
  ('X-Ray Machine', 'equipment', 'Digital X-ray equipment'),
  ('Sterilization Unit', 'equipment', 'Autoclave sterilization unit');

INSERT INTO public.appointment_types (name, appointment_type, duration_minutes, color, description) VALUES
  ('Consultation', 'consultation', 30, '#3b82f6', 'Initial patient consultation'),
  ('Cleaning', 'cleaning', 60, '#10b981', 'Regular dental cleaning'),
  ('Filling', 'filling', 45, '#f59e0b', 'Cavity filling procedure'),
  ('Checkup', 'checkup', 30, '#8b5cf6', 'Routine dental checkup'),
  ('Emergency', 'emergency', 30, '#ef4444', 'Emergency dental treatment');

-- Set up provider schedules (Monday to Friday, 8 AM to 5 PM)
INSERT INTO public.provider_schedules (provider_id, day_of_week, start_time, end_time, break_start_time, break_end_time)
SELECT 
  p.id,
  d.day,
  '08:00'::TIME,
  '17:00'::TIME,
  '12:00'::TIME,
  '13:00'::TIME
FROM public.providers p
CROSS JOIN (
  VALUES ('monday'), ('tuesday'), ('wednesday'), ('thursday'), ('friday')
) AS d(day);