import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Appointment, 
  Provider, 
  AppointmentTypeConfig, 
  Resource, 
  CalendarEvent,
  AppointmentFormData,
  AvailabilitySlot 
} from '@/types/scheduling';
import { toast } from '@/hooks/use-toast';

export function useScheduling() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentTypeConfig[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Load initial data
  useEffect(() => {
    loadProviders();
    loadAppointmentTypes();
    loadResources();
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  const loadProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error loading providers:', error);
      toast({
        title: "Error",
        description: "Failed to load providers",
        variant: "destructive"
      });
    }
  };

  const loadAppointmentTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_types')
        .select('*')
        .order('name');

      if (error) throw error;
      setAppointmentTypes(data || []);
    } catch (error) {
      console.error('Error loading appointment types:', error);
      toast({
        title: "Error",
        description: "Failed to load appointment types",
        variant: "destructive"
      });
    }
  };

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_available', true)
        .order('name');

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error loading resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive"
      });
    }
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      
      // Get start and end of the selected month for better performance
      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          provider:providers(*),
          appointment_type:appointment_types(*),
          resource:resources(*)
        `)
        .gte('start_time', startOfMonth.toISOString())
        .lte('start_time', endOfMonth.toISOString())
        .order('start_time');

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: AppointmentFormData) => {
    try {
      setLoading(true);

      // Calculate end time
      const startTime = new Date(appointmentData.start_time);
      const endTime = new Date(startTime.getTime() + appointmentData.duration_minutes * 60000);

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: appointmentData.patient_id,
          provider_id: appointmentData.provider_id,
          appointment_type_id: appointmentData.appointment_type_id,
          resource_id: appointmentData.resource_id,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          notes: appointmentData.notes,
          is_recurring: appointmentData.is_recurring,
          status: 'scheduled'
        })
        .select(`
          *,
          provider:providers(*),
          appointment_type:appointment_types(*),
          resource:resources(*)
        `)
        .single();

      if (error) throw error;

      setAppointments(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Appointment created successfully"
      });

      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          provider:providers(*),
          appointment_type:appointment_types(*),
          resource:resources(*)
        `)
        .single();

      if (error) throw error;

      setAppointments(prev => 
        prev.map(apt => apt.id === id ? data : apt)
      );

      toast({
        title: "Success",
        description: "Appointment updated successfully"
      });

      return data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments(prev => prev.filter(apt => apt.id !== id));
      toast({
        title: "Success",
        description: "Appointment deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (
    providerId: string, 
    startTime: Date, 
    endTime: Date,
    excludeAppointmentId?: string
  ): Promise<boolean> => {
    try {
      let query = supabase
        .from('appointments')
        .select('id')
        .eq('provider_id', providerId)
        .or(
          `and(start_time.lt.${endTime.toISOString()},end_time.gt.${startTime.toISOString()})`
        );

      if (excludeAppointmentId) {
        query = query.neq('id', excludeAppointmentId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.length === 0;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  };

  const getAvailableSlots = async (
    providerId: string,
    date: Date,
    durationMinutes: number
  ): Promise<AvailabilitySlot[]> => {
    try {
      // Get provider schedule for the given day
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as 
        'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
      
      const { data: schedule, error: scheduleError } = await supabase
        .from('provider_schedules')
        .select('*')
        .eq('provider_id', providerId)
        .eq('day_of_week', dayName)
        .eq('is_available', true)
        .single();

      if (scheduleError || !schedule) return [];

      // Get existing appointments for the date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('provider_id', providerId)
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString())
        .order('start_time');

      if (appointmentsError) throw appointmentsError;

      // Calculate available slots (simplified logic)
      const slots: AvailabilitySlot[] = [];
      const workStart = new Date(date);
      const [startHour, startMinute] = schedule.start_time.split(':');
      workStart.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      const workEnd = new Date(date);
      const [endHour, endMinute] = schedule.end_time.split(':');
      workEnd.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      // Simple slot generation (15-minute intervals)
      let currentTime = new Date(workStart);
      while (currentTime < workEnd) {
        const slotEnd = new Date(currentTime.getTime() + durationMinutes * 60000);
        
        if (slotEnd <= workEnd) {
          const isAvailable = !appointments?.some(apt => {
            const aptStart = new Date(apt.start_time);
            const aptEnd = new Date(apt.end_time);
            return (currentTime < aptEnd && slotEnd > aptStart);
          });

          if (isAvailable) {
            slots.push({
              start_time: currentTime.toISOString(),
              end_time: slotEnd.toISOString(),
              provider_id: providerId,
              is_available: true
            });
          }
        }

        currentTime = new Date(currentTime.getTime() + 15 * 60000); // 15-minute intervals
      }

      return slots;
    } catch (error) {
      console.error('Error getting available slots:', error);
      return [];
    }
  };

  // Convert appointments to calendar events
  const getCalendarEvents = (): CalendarEvent[] => {
    return appointments.map(appointment => ({
      id: appointment.id,
      title: `${appointment.provider?.name} - ${appointment.appointment_type?.name}`,
      start: appointment.start_time,
      end: appointment.end_time,
      backgroundColor: appointment.appointment_type?.color || '#3b82f6',
      borderColor: appointment.appointment_type?.color || '#3b82f6',
      textColor: '#ffffff',
      extendedProps: {
        appointment,
        provider: appointment.provider,
        type: 'appointment'
      }
    }));
  };

  return {
    // State
    appointments,
    providers,
    appointmentTypes,
    resources,
    loading,
    selectedDate,
    setSelectedDate,

    // Actions
    createAppointment,
    updateAppointment,
    deleteAppointment,
    checkAvailability,
    getAvailableSlots,
    loadAppointments,

    // Calendar helpers
    getCalendarEvents
  };
}