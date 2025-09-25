import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
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

  const getStatusColor = (status: 'occupied' | 'available' | 'maintenance') => {
    switch (status) {
      case 'occupied': return 'bg-red-500';
      case 'available': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: 'occupied' | 'available' | 'maintenance') => {
    switch (status) {
      case 'occupied': return 'occupied';
      case 'available': return 'available';
      case 'maintenance': return 'maintenance';
      default: return 'unknown';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-base">Chair Status</h3>
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
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-3">
        <h3 className="font-semibold text-base text-foreground">Chair Status</h3>
        
        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="h-8 text-xs">
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
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="List View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="list">List View</SelectItem>
              <SelectItem value="grid">Grid View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chair List */}
      <div className="space-y-2">
        {resources.map(resource => {
          const status = chairStatuses[resource.id];
          const statusColor = getStatusColor(status?.status || 'available');
          const statusText = getStatusText(status?.status || 'available');

          return (
            <div 
              key={resource.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
              onClick={() => onChairClick?.(resource)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground">
                  {resource.name}
                </div>
                {status?.provider && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {status.provider}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-0.5 ${
                    status?.status === 'occupied' ? 'text-red-700 border-red-200 bg-red-50' :
                    status?.status === 'available' ? 'text-green-700 border-green-200 bg-green-50' :
                    'text-yellow-700 border-yellow-200 bg-yellow-50'
                  }`}
                >
                  {statusText}
                </Badge>
              </div>
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
    </div>
  );
}