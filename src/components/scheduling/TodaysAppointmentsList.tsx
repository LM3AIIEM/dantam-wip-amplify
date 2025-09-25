import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Phone, User, MapPin } from 'lucide-react';
import { useScheduling } from '@/hooks/useScheduling';
import { format, isToday } from 'date-fns';

interface TodaysAppointmentsListProps {
  className?: string;
}

export function TodaysAppointmentsList({ className }: TodaysAppointmentsListProps) {
  const { appointments, loading } = useScheduling();
  const [todaysAppointments, setTodaysAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (appointments) {
      const today = appointments.filter(apt => 
        isToday(new Date(apt.start_time)) && apt.status !== 'cancelled'
      ).sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
      setTodaysAppointments(today);
    }
  }, [appointments]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">confirmed</Badge>;
      case 'waiting':
        return <Badge variant="outline" className="text-yellow-700 border-yellow-200 bg-yellow-50">waiting</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-gray-700 border-gray-200 bg-gray-50">pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    return `${durationMinutes}min`;
  };

  const getPatientPhone = () => {
    // Mock phone numbers since we don't have patient table integration yet
    const phoneNumbers = [
      '+91 98765 43210',
      '+91 87654 32109', 
      '+91 76543 21098',
      '+91 65432 10987',
      '+91 54321 09876',
      '+91 43210 98765'
    ];
    return phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border bg-muted/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Today's Appointments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
        {todaysAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium text-foreground mb-2">No appointments today</h4>
            <p className="text-sm text-muted-foreground">All clear for today!</p>
          </div>
        ) : (
          todaysAppointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="p-4 rounded-lg border bg-card hover:bg-muted/20 transition-colors cursor-pointer"
            >
              <div className="space-y-3">
                {/* Header with patient name and status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {appointment.patient?.name || 'Patient Name'}
                    </span>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>

                {/* Time and duration */}
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">
                    {format(new Date(appointment.start_time), 'HH:mm')}
                  </span>
                  <span className="text-muted-foreground">
                    ({getDuration(appointment.start_time, appointment.end_time)})
                  </span>
                </div>

                {/* Phone number */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{getPatientPhone()}</span>
                </div>

                {/* Provider and chair info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {appointment.resource?.name || 'Chair'} - {appointment.provider?.name || 'Provider'}
                  </span>
                </div>

                {/* Appointment type */}
                {appointment.appointment_type && (
                  <div className="text-sm text-primary font-medium">
                    {appointment.appointment_type.name}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}