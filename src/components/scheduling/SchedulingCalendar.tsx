import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, MapPin } from 'lucide-react';
import { useScheduling } from '@/hooks/useScheduling';
import { AppointmentDialog } from './AppointmentDialog';
import { CalendarEvent } from '@/types/scheduling';

export function SchedulingCalendar() {
  const { getCalendarEvents, loading, selectedDate, setSelectedDate } = useScheduling();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  const handleDateSelect = (selectInfo: any) => {
    setSelectedSlot({
      start: selectInfo.start,
      end: selectInfo.end
    });
    setShowAppointmentDialog(true);
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const calendarEvents = getCalendarEvents();

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Appointment Scheduler
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
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                initialView="timeGridWeek"
                slotMinTime="07:00:00"
                slotMaxTime="19:00:00"
                slotDuration="00:15:00"
                events={calendarEvents}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventClassNames="cursor-pointer"
                height="600px"
                businessHours={{
                  daysOfWeek: [1, 2, 3, 4, 5],
                  startTime: '08:00',
                  endTime: '17:00'
                }}
                datesSet={(dateInfo) => {
                  handleDateChange(dateInfo.start);
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Appointment Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-sm">Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-sm">Cleaning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500"></div>
                <span className="text-sm">Filling</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500"></div>
                <span className="text-sm">Checkup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-sm">Emergency</span>
              </div>
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
                {selectedEvent.extendedProps?.appointment?.notes && (
                  <div>
                    <p className="text-xs text-muted-foreground">Notes:</p>
                    <p className="text-sm">{selectedEvent.extendedProps.appointment.notes}</p>
                  </div>
                )}
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
                View Wait List
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Resource Management
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Provider Schedules
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