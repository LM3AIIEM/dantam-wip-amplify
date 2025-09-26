import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User, MapPin, Clock, Users, Activity } from 'lucide-react';
import { useScheduling } from '@/hooks/useScheduling';
import { AppointmentDialog } from './AppointmentDialog';
import { CalendarEvent } from '@/types/scheduling';

export function ProviderLaneCalendar() {
  const { providers, resources, getCalendarEvents, loading } = useScheduling();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date; resourceId?: string } | null>(null);

  const handleDateSelect = (selectInfo: any) => {
    setSelectedSlot({
      start: selectInfo.start,
      end: selectInfo.end,
      resourceId: selectInfo.resource?.id
    });
    setShowAppointmentDialog(true);
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
  };

  // Format resources for FullCalendar with provider grouping
  const calendarResources = providers.map(provider => ({
    id: provider.id,
    title: provider.name,
    eventColor: provider.provider_type === 'dentist' ? 'hsl(217, 91%, 60%)' : 
                provider.provider_type === 'hygienist' ? 'hsl(142, 71%, 45%)' :
                provider.provider_type === 'specialist' ? 'hsl(24, 95%, 53%)' : 'hsl(215, 20%, 65%)',
    extendedProps: {
      provider,
      type: provider.provider_type,
      specialization: provider.specialization
    }
  }));

  // Convert appointments to resource events
  const resourceEvents = getCalendarEvents().map(event => ({
    ...event,
    resourceId: event.extendedProps?.appointment?.provider_id,
    title: `${event.extendedProps?.patient?.name || 'Patient'} - ${event.extendedProps?.appointment?.appointment_type?.name}`,
    extendedProps: {
      ...event.extendedProps,
      resource: event.extendedProps?.appointment?.resource
    }
  }));

  // Calculate provider utilization
  const getProviderUtilization = (providerId: string) => {
    const providerEvents = resourceEvents.filter(event => event.resourceId === providerId);
    const totalSlots = 32; // 8 hours * 4 slots per hour
    const occupiedSlots = providerEvents.length;
    return Math.round((occupiedSlots / totalSlots) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header card removed to save space for calendar */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Provider Lane Calendar - Full width */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardContent className="p-6">
              <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'timeGridWeek,timeGridDay'
                }}
                events={resourceEvents.map(event => ({
                  ...event,
                  title: `${event.extendedProps?.appointment?.provider?.name || 'Provider'}: ${event.title}`,
                  backgroundColor: event.extendedProps?.appointment?.provider_id === providers[0]?.id ? 'hsl(217, 91%, 60%)' :
                                   event.extendedProps?.appointment?.provider_id === providers[1]?.id ? 'hsl(142, 71%, 45%)' :
                                   'hsl(215, 20%, 65%)'
                }))}
                slotMinTime="07:00:00"
                slotMaxTime="19:00:00"
                slotDuration="00:15:00"
                selectable={true}
                selectMirror={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventClassNames="cursor-pointer"
                height="calc(100vh - 320px)"
                businessHours={{
                  daysOfWeek: [1, 2, 3, 4, 5],
                  startTime: '08:00',
                  endTime: '17:00'
                }}
                eventContent={(eventInfo) => (
                  <div className="p-1 text-xs">
                    <div className="font-medium truncate">
                      {eventInfo.event.title}
                    </div>
                    {eventInfo.event.extendedProps?.appointment?.resource && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-2 w-2" />
                        <span className="truncate">
                          {eventInfo.event.extendedProps.appointment.resource.name}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Resource Utilization Sidebar */}
        <div className="space-y-4">
          {/* Resource Status - Commented out: Replaced by ChairStatusPanel in dashboard sidebar */}
          {/*
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Resource Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resources.slice(0, 6).map(resource => (
                <div key={resource.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{resource.name}</div>
                    <div className="text-xs text-muted-foreground">{resource.resource_type}</div>
                  </div>
                  <Badge variant={resource.is_available ? "default" : "secondary"}>
                    {resource.is_available ? "Available" : "Occupied"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          */}

          {/* Provider Performance - Moved to ChairStatusTabs component */}

          {/* Selected Event Details */}
          {selectedEvent && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {selectedEvent.extendedProps?.provider?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(selectedEvent.start!).toLocaleTimeString()} - 
                    {new Date(selectedEvent.end!).toLocaleTimeString()}
                  </span>
                </div>
                    {selectedEvent.extendedProps?.appointment?.resource && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {selectedEvent.extendedProps.appointment.resource.name}
                        </span>
                      </div>
                    )}
                <Badge variant="outline">
                  {selectedEvent.extendedProps?.appointment?.status}
                </Badge>
              </CardContent>
            </Card>
          )}

        </div>
      </div>

      {/* Appointment Dialog */}
      <AppointmentDialog
        open={showAppointmentDialog}
        onOpenChange={setShowAppointmentDialog}
        selectedSlot={selectedSlot}
        existingAppointment={selectedEvent?.extendedProps?.appointment}
      />
    </div>
  );
}