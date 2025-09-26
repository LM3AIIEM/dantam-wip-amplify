import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  TrendingUp,
  Users,
  AlertCircle,
  Settings,
  ClipboardList,
  Wrench
} from 'lucide-react';
import { useScheduling } from '@/hooks/useScheduling';
import { useNavigate } from 'react-router-dom';

export function SchedulingMetrics() {
  const { appointments, resources, loading, selectedDate } = useScheduling();
  const navigate = useNavigate();

  const handleManageProviders = () => {
    navigate('/provider-management');
  };

  const handleWaitList = () => {
    navigate('/wait-list');
  };

  const handleResourceSetup = () => {
    console.log('Navigate to /resource-setup'); // Placeholder for future route
  };

  const metrics = useMemo(() => {
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Filter appointments for selected date
    const todayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.start_time);
      return aptDate >= startOfDay && aptDate <= endOfDay;
    });

    // Total appointments
    const totalAppointments = todayAppointments.length;

    // Pending appointments (scheduled status)
    const pendingAppointments = todayAppointments.filter(apt => 
      apt.status === 'scheduled'
    ).length;

    // Chair utilization
    const chairResources = resources.filter(r => 
      r.resource_type === 'chair' || r.resource_type === 'operatory'
    );
    const totalChairs = chairResources.length;
    
    // Current occupied chairs (for today only)
    let occupiedChairs = 0;
    if (isToday) {
      const now = new Date();
      occupiedChairs = todayAppointments.filter(apt => {
        const startTime = new Date(apt.start_time);
        const endTime = new Date(apt.end_time);
        return startTime <= now && endTime > now && apt.status !== 'cancelled';
      }).length;
    }

    const chairUtilization = totalChairs > 0 ? (occupiedChairs / totalChairs) * 100 : 0;

    // Overall utilization (appointments vs available time slots)
    // Simplified calculation: total appointment hours vs total available chair hours
    const totalAppointmentMinutes = todayAppointments.reduce((sum, apt) => {
      const start = new Date(apt.start_time);
      const end = new Date(apt.end_time);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);

    // Assume 8-hour workday per chair
    const totalAvailableMinutes = totalChairs * 8 * 60;
    const overallUtilization = totalAvailableMinutes > 0 ? 
      (totalAppointmentMinutes / totalAvailableMinutes) * 100 : 0;

    return {
      totalAppointments,
      pendingAppointments,
      occupiedChairs,
      totalChairs,
      chairUtilization: Math.round(chairUtilization),
      overallUtilization: Math.round(Math.min(overallUtilization, 100)),
      isToday
    };
  }, [appointments, resources, selectedDate]);

  if (loading) {
    return <SchedulingMetricsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Quick Actions - Moved from ProviderLaneCalendar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={handleManageProviders}
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Providers
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={handleWaitList}
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            Wait List
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={handleResourceSetup}
          >
            <Wrench className="h-4 w-4 mr-2" />
            Resource Setup
          </Button>
        </CardContent>
      </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {metrics.isToday ? "Today's Appointments" : "Appointments"}
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {metrics.totalAppointments}
          </div>
          <p className="text-xs text-muted-foreground">
            {metrics.isToday ? 'scheduled for today' : 'for selected date'}
          </p>
        </CardContent>
      </Card>

      {/* Chair Utilization */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chair Status</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className="text-destructive">{metrics.occupiedChairs}</span>
            <span className="text-muted-foreground text-lg">/{metrics.totalChairs}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.chairUtilization}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {metrics.chairUtilization}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {metrics.isToday ? 'currently occupied' : 'chairs assigned'}
          </p>
        </CardContent>
      </Card>

      {/* Pending Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">
            {metrics.pendingAppointments}
          </div>
          <p className="text-xs text-muted-foreground">
            appointments need attention
          </p>
        </CardContent>
      </Card>

      {/* Overall Utilization */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilization</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {metrics.overallUtilization}%
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.overallUtilization}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {metrics.isToday ? 'practice efficiency' : 'scheduled capacity'}
          </p>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

function SchedulingMetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}