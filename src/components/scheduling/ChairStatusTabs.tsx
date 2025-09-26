import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useScheduling } from '@/hooks/useScheduling';
import { Resource } from '@/types/scheduling';

interface ChairStatusTabsProps {
  onChairClick?: (chair: Resource) => void;
}

export function ChairStatusTabs({ onChairClick }: ChairStatusTabsProps) {
  const { resources, appointments, providers, loading, getCalendarEvents } = useScheduling();
  const [chairStatuses, setChairStatuses] = useState<Record<string, {
    status: 'occupied' | 'available' | 'maintenance';
    provider?: string;
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

      // Determine status
      let status: 'occupied' | 'available' | 'maintenance' = 'available';
      
      if (!resource.is_available) {
        status = 'maintenance';
      } else if (currentAppointment) {
        status = 'occupied';
      }

      const provider = currentAppointment?.provider?.name;

      statuses[resource.id] = {
        status,
        provider
      };
    });

    setChairStatuses(statuses);
  };

  const getStatusText = (status: 'occupied' | 'available' | 'maintenance') => {
    switch (status) {
      case 'occupied': return 'occupied';
      case 'available': return 'available';
      case 'maintenance': return 'maintenance';
      default: return 'unknown';
    }
  };

  // Calculate provider utilization
  const getProviderUtilization = (providerId: string) => {
    const resourceEvents = getCalendarEvents().filter(event => 
      event.extendedProps?.appointment?.provider_id === providerId
    );
    const totalSlots = 32; // 8 hours * 4 slots per hour
    const occupiedSlots = resourceEvents.length;
    return Math.round((occupiedSlots / totalSlots) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-base">Loading...</h3>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="chairs" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="chairs">Chair Status</TabsTrigger>
        <TabsTrigger value="utilization">Utilization</TabsTrigger>
      </TabsList>

      <TabsContent value="chairs" className="space-y-4 mt-4">
        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Chairs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chairs</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="list">
            <SelectTrigger className="h-9">
              <SelectValue placeholder="List View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="list">List View</SelectItem>
              <SelectItem value="grid">Grid View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chair List */}
        <div className="space-y-3">
          {resources.map(resource => {
            const status = chairStatuses[resource.id];
            const statusText = getStatusText(status?.status || 'available');

            return (
              <div 
                key={resource.id}
                className="flex items-center justify-between py-3 px-2 hover:bg-muted/50 cursor-pointer transition-colors rounded-md"
                onClick={() => onChairClick?.(resource)}
              >
                <div className="flex-1">
                  <div className="font-semibold text-foreground text-base">
                    {resource.name}
                  </div>
                  {status?.provider && (
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {status.provider}
                    </div>
                  )}
                </div>
                
                <Badge 
                  className={`text-sm px-3 py-1 font-medium ${
                    status?.status === 'occupied' 
                      ? 'bg-red-100 text-red-700 hover:bg-red-100' 
                      : status?.status === 'available' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                  }`}
                >
                  {statusText}
                </Badge>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {resources.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-sm">No chairs available</div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="utilization" className="space-y-4 mt-4">
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Today's Utilization</h4>
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
        </div>

        {providers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-sm">No providers available</div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}