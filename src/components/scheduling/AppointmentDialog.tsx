import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, Clock, User, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useScheduling } from '@/hooks/useScheduling';
import { Appointment, AppointmentFormData, AvailabilitySlot } from '@/types/scheduling';
import { usePatients } from '@/hooks/usePatients';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlot?: { start: Date; end: Date } | null;
  existingAppointment?: Appointment;
}

export function AppointmentDialog({ 
  open, 
  onOpenChange, 
  selectedSlot, 
  existingAppointment 
}: AppointmentDialogProps) {
  const { 
    providers, 
    appointmentTypes, 
    resources, 
    createAppointment, 
    updateAppointment,
    deleteAppointment,
    checkAvailability,
    getAvailableSlots,
    loading 
  } = useScheduling();

  const { patients, loading: patientsLoading } = usePatients();

  const [formData, setFormData] = useState<Partial<AppointmentFormData>>({
    patient_id: '',
    provider_id: '',
    appointment_type_id: '',
    resource_id: '',
    start_time: '',
    duration_minutes: 30,
    notes: '',
    is_recurring: false
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [conflicts, setConflicts] = useState<Appointment[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (existingAppointment) {
      setIsEditing(true);
      const startTime = new Date(existingAppointment.start_time);
      const endTime = new Date(existingAppointment.end_time);
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

      setFormData({
        patient_id: existingAppointment.patient_id,
        provider_id: existingAppointment.provider_id,
        appointment_type_id: existingAppointment.appointment_type_id,
        resource_id: existingAppointment.resource_id || '',
        start_time: existingAppointment.start_time,
        duration_minutes: duration,
        notes: existingAppointment.notes || '',
        is_recurring: existingAppointment.is_recurring
      });

      setSelectedDate(startTime);
      setSelectedTime(format(startTime, 'HH:mm'));
    } else if (selectedSlot) {
      const duration = Math.round((selectedSlot.end.getTime() - selectedSlot.start.getTime()) / (1000 * 60));
      
      setFormData({
        ...formData,
        start_time: selectedSlot.start.toISOString(),
        duration_minutes: duration
      });

      setSelectedDate(selectedSlot.start);
      setSelectedTime(format(selectedSlot.start, 'HH:mm'));
    }
  }, [existingAppointment, selectedSlot]);

  // Load available slots when provider, date, or duration changes
  useEffect(() => {
    if (formData.provider_id && selectedDate && formData.duration_minutes) {
      loadAvailableSlots();
    }
  }, [formData.provider_id, selectedDate, formData.duration_minutes]);

  // Check for conflicts when time selection changes
  useEffect(() => {
    if (formData.provider_id && selectedDate && selectedTime && formData.duration_minutes) {
      checkForConflicts();
    }
  }, [formData.provider_id, selectedDate, selectedTime, formData.duration_minutes]);

  const loadAvailableSlots = async () => {
    if (!formData.provider_id || !selectedDate || !formData.duration_minutes) return;

    try {
      const slots = await getAvailableSlots(
        formData.provider_id,
        selectedDate,
        formData.duration_minutes
      );
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
    }
  };

  const checkForConflicts = async () => {
    if (!formData.provider_id || !selectedDate || !selectedTime || !formData.duration_minutes) {
      setConflicts([]);
      return;
    }

    const startDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDateTime = new Date(startDateTime.getTime() + formData.duration_minutes * 60000);

    const isAvailable = await checkAvailability(
      formData.provider_id,
      startDateTime,
      endDateTime,
      existingAppointment?.id
    );

    // For demo purposes, we'll show conflicts if not available
    if (!isAvailable) {
      setConflicts([
        {
          id: 'conflict-1',
          patient_id: 'sample-patient',
          provider_id: formData.provider_id,
          appointment_type_id: 'sample-type',
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          status: 'scheduled',
          is_recurring: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Appointment
      ]);
    } else {
      setConflicts([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !formData.provider_id || !formData.appointment_type_id) {
      return;
    }

    const startDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const appointmentData: AppointmentFormData = {
      patient_id: formData.patient_id || patients[0]?.id,
      provider_id: formData.provider_id,
      appointment_type_id: formData.appointment_type_id,
      resource_id: formData.resource_id,
      start_time: startDateTime.toISOString(),
      duration_minutes: formData.duration_minutes || 30,
      notes: formData.notes,
      is_recurring: formData.is_recurring || false
    };

    try {
      if (isEditing && existingAppointment) {
        await updateAppointment(existingAppointment.id, {
          ...appointmentData,
          end_time: new Date(startDateTime.getTime() + appointmentData.duration_minutes * 60000).toISOString()
        });
      } else {
        await createAppointment(appointmentData);
      }
      
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleDelete = async () => {
    if (existingAppointment) {
      try {
        await deleteAppointment(existingAppointment.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      provider_id: '',
      appointment_type_id: '',
      resource_id: '',
      start_time: '',
      duration_minutes: 30,
      notes: '',
      is_recurring: false
    });
    setSelectedDate(new Date());
    setSelectedTime('');
    setAvailableSlots([]);
    setConflicts([]);
    setIsEditing(false);
  };

  const selectedProvider = providers.find(p => p.id === formData.provider_id);
  const selectedAppointmentType = appointmentTypes.find(t => t.id === formData.appointment_type_id);

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Appointment' : 'New Appointment'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Patient Selection */}
              <div className="space-y-2">
                <Label htmlFor="patient">Patient</Label>
                <Select 
                  value={formData.patient_id} 
                  onValueChange={(value) => setFormData({...formData, patient_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Provider Selection */}
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Select 
                  value={formData.provider_id} 
                  onValueChange={(value) => setFormData({...formData, provider_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map(provider => (
                      <SelectItem key={provider.id} value={provider.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{provider.provider_type}</Badge>
                          {provider.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Appointment Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Select 
                  value={formData.appointment_type_id} 
                  onValueChange={(value) => {
                    const type = appointmentTypes.find(t => t.id === value);
                    setFormData({
                      ...formData, 
                      appointment_type_id: value,
                      duration_minutes: type?.duration_minutes || 30
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded" 
                            style={{ backgroundColor: type.color }}
                          ></div>
                          {type.name} ({type.duration_minutes} min)
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resource Selection */}
              <div className="space-y-2">
                <Label htmlFor="resource">Resource (Optional)</Label>
                <Select 
                  value={formData.resource_id} 
                  onValueChange={(value) => setFormData({...formData, resource_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific resource</SelectItem>
                    {resources.map(resource => (
                      <SelectItem key={resource.id} value={resource.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{resource.resource_type}</Badge>
                          {resource.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({
                    ...formData, 
                    duration_minutes: parseInt(e.target.value) || 30
                  })}
                  min={15}
                  max={240}
                  step={15}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>

              {/* Recurring */}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_recurring}
                  onCheckedChange={(checked) => setFormData({...formData, is_recurring: checked})}
                />
                <Label>Recurring appointment</Label>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>

              {/* Available Slots */}
              {availableSlots.length > 0 && (
                <div className="space-y-2">
                  <Label>Available Time Slots</Label>
                  <Card>
                    <CardContent className="p-3 max-h-32 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-1">
                        {availableSlots.slice(0, 12).map((slot, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              const slotTime = new Date(slot.start_time);
                              setSelectedTime(format(slotTime, 'HH:mm'));
                            }}
                          >
                            {format(new Date(slot.start_time), 'HH:mm')}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Conflicts Warning */}
              {conflicts.length > 0 && (
                <Card className="border-destructive">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Schedule Conflict</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      This time slot conflicts with an existing appointment.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Provider Info */}
              {selectedProvider && (
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{selectedProvider.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{selectedProvider.specialization}</p>
                      <Badge variant="outline" className="mt-1">
                        {selectedProvider.provider_type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Appointment Type Info */}
              {selectedAppointmentType && (
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{selectedAppointmentType.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Duration: {selectedAppointmentType.duration_minutes} minutes</p>
                      <p>{selectedAppointmentType.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <div>
              {isEditing && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete Appointment
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || conflicts.length > 0 || !formData.provider_id || !formData.appointment_type_id}
              >
                {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'} Appointment
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}