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
      {/* Header with Provider Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Provider Schedule & Utilization
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAppointmentDialog(true)}
              >
                New Appointment
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {providers.slice(0, 4).map(provider => (
              <div key={provider.id} className="text-center p-3 bg-muted/20 rounded-lg">
                <div className="text-sm font-medium">{provider.name}</div>
                <div className="text-xs text-muted-foreground mb-2">{provider.provider_type}</div>
                <div className="flex items-center justify-center gap-1">
                  <Activity className="h-3 w-3" />
                  <span className="text-sm font-semibold text-primary">
                    {getProviderUtilization(provider.id)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Provider Lane Calendar */}
        <div className="lg:col-span-3">
          <Card>
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
                height="600px"
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
          {/* Resource Status */}
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

          {/* Provider Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Today's Utilization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {providers.map(provider => (
                <div key={provider.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{provider.name}</span>
                    <span className="text-sm text-primary font-semibold">
                      {getProviderUtilization(provider.id)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProviderUtilization(provider.id)}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

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

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                Manage Providers
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Wait List
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Resource Setup
              </Button>
            </CardContent>
          </Card>
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