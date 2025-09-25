import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  User, 
  Clock,
  Settings,
  Wrench,
  Eye
} from 'lucide-react';
import { useScheduling } from '@/hooks/useScheduling';
import { Resource } from '@/types/scheduling';

interface ChairStatusPanelProps {
  onChairClick?: (chair: Resource) => void;
}

export function ChairStatusPanel({ onChairClick }: ChairStatusPanelProps) {
  const { resources, appointments, providers, loading } = useScheduling();
  const [chairStatuses, setChairStatuses] = useState<Record<string, {
    status: 'occupied' | 'available' | 'maintenance';
    provider?: string;
    nextAppointment?: Date;
    currentPatient?: string;
  }>>({});

  useEffect(() => {
    updateChairStatuses();
  }, [resources, appointments, providers]);

  const updateChairStatuses = () => {
    const now = new Date();
    const statuses: typeof chairStatuses = {};

    resources.forEach(resource => {
      // Find current appointment for this resource
      const currentAppointment = appointments.find(apt => 
        apt.resource_id === resource.id &&
        new Date(apt.start_time) <= now &&
        new Date(apt.end_time) > now &&
        apt.status !== 'cancelled'
      );

      // Find next appointment for this resource
      const nextAppointment = appointments
        .filter(apt => 
          apt.resource_id === resource.id &&
          new Date(apt.start_time) > now &&
          apt.status !== 'cancelled'
        )
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0];

      // Determine status
      let status: 'occupied' | 'available' | 'maintenance' = 'available';
      
      if (!resource.is_available) {
        status = 'maintenance';
      } else if (currentAppointment) {
        status = 'occupied';
      }

      const provider = currentAppointment?.provider?.name || 
                     (nextAppointment?.provider?.name ? `Next: ${nextAppointment.provider.name}` : undefined);

      statuses[resource.id] = {
        status,
        provider,
        nextAppointment: nextAppointment ? new Date(nextAppointment.start_time) : undefined,
        currentPatient: currentAppointment ? 'Patient' : undefined // Would need patient data for actual name
      };
    });

    setChairStatuses(statuses);
  };

  const getStatusColor = (status: 'occupied' | 'available' | 'maintenance') => {
    switch (status) {
      case 'occupied': return 'hsl(0, 72%, 51%)'; // Red
      case 'available': return 'hsl(142, 71%, 45%)'; // Green
      case 'maintenance': return 'hsl(24, 95%, 53%)'; // Yellow
      default: return 'hsl(215, 20%, 65%)';
    }
  };

  const getStatusBadgeVariant = (status: 'occupied' | 'available' | 'maintenance') => {
    switch (status) {
      case 'occupied': return 'destructive';
      case 'available': return 'default';
      case 'maintenance': return 'secondary';
      default: return 'secondary';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'chair': return <MapPin className="h-4 w-4" />;
      case 'operatory': return <Settings className="h-4 w-4" />;
      case 'equipment': return <Wrench className="h-4 w-4" />;
      case 'room': return <MapPin className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chair Status Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading chair statuses...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Chair Status Panel
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time chair and room availability status
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {resources.map(resource => {
            const status = chairStatuses[resource.id];
            const statusColor = getStatusColor(status?.status || 'available');

            return (
              <Card 
                key={resource.id} 
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                onClick={() => onChairClick?.(resource)}
              >
                <CardContent className="p-4">
                  {/* Status Indicator */}
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${statusColor}20` }}
                    >
                      {getResourceIcon(resource.resource_type)}
                    </div>
                    <Badge 
                      variant={getStatusBadgeVariant(status?.status || 'available')}
                      className="text-xs"
                    >
                      {status?.status === 'occupied' ? 'Occupied' : 
                       status?.status === 'maintenance' ? 'Maintenance' : 'Available'}
                    </Badge>
                  </div>

                  {/* Chair Info */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">{resource.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">
                      {resource.resource_type}
                    </p>

                    {/* Provider Assignment */}
                    {status?.provider && (
                      <div className="flex items-center gap-1 text-xs">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">
                          {status.provider}
                        </span>
                      </div>
                    )}

                    {/* Current Patient */}
                    {status?.currentPatient && (
                      <div className="text-xs text-primary font-medium">
                        {status.currentPatient}
                      </div>
                    )}

                    {/* Next Appointment */}
                    {status?.nextAppointment && !status?.currentPatient && (
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Next: {formatTime(status.nextAppointment)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-3 pt-2 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChairClick?.(resource);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {resources.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Resources Available</h3>
            <p className="text-muted-foreground">
              Add chairs and rooms to see their status here.
            </p>
          </div>
        )}

        {/* Status Legend */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-muted-foreground">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="text-muted-foreground">Maintenance</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}