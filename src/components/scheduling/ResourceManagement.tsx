import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Settings, 
  Calendar,
  Clock,
  Wrench,
  Plus,
  Search
} from 'lucide-react';
import { useScheduling } from '@/hooks/useScheduling';

export function ResourceManagement() {
  const { resources } = useScheduling();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.resource_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'chair': return 'hsl(217, 91%, 60%)';
      case 'operatory': return 'hsl(142, 71%, 45%)';
      case 'equipment': return 'hsl(24, 95%, 53%)';
      case 'room': return 'hsl(215, 20%, 65%)';
      default: return 'hsl(215, 20%, 65%)';
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

  // Mock utilization data
  const getResourceUtilization = () => Math.floor(Math.random() * 40) + 40;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Resource Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage chairs, operatories, and equipment
          </p>
        </div>
        <Button className="medical-button-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(resource => (
          <Card key={resource.id} className="patient-card">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${getResourceTypeColor(resource.resource_type)}20` }}
                  >
                    {getResourceIcon(resource.resource_type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{resource.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {resource.resource_type}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={resource.is_available ? "default" : "secondary"}
                  className={resource.is_available ? "status-active" : "status-inactive"}
                >
                  {resource.is_available ? "Available" : "In Use"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              {resource.description && (
                <p className="text-sm text-muted-foreground">
                  {resource.description}
                </p>
              )}

              {/* Utilization */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Today's Utilization</span>
                  <span className="text-sm font-semibold text-primary">
                    {getResourceUtilization()}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getResourceUtilization()}%` }}
                  />
                </div>
              </div>

              {/* Status Info */}
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {resource.is_available ? 'Ready for use' : 'Currently occupied'}
                </div>
                {resource.maintenance_schedule && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Next maintenance: In 3 days
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Wrench className="h-3 w-3 mr-1" />
                  Maintain
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Resources Found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'No resources match your search.' : 'No resources available.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}