import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  User, 
  Clock, 
  Activity, 
  Calendar,
  Settings,
  BarChart3,
  Phone,
  Mail
} from 'lucide-react';
import { useScheduling } from '@/hooks/useScheduling';
import { AddProviderDialog } from '@/components/scheduling/AddProviderDialog';

export default function ProviderManagementPage() {
  const { providers, loading } = useScheduling();
  const [showAddProvider, setShowAddProvider] = useState(false);

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Scheduling', href: '/scheduling' },
    { title: 'Provider Management', isCurrentPage: true }
  ];

  const getProviderTypeColor = (type: string) => {
    switch (type) {
      case 'dentist': return 'hsl(217, 91%, 60%)';
      case 'hygienist': return 'hsl(142, 71%, 45%)';
      case 'specialist': return 'hsl(24, 95%, 53%)';
      default: return 'hsl(215, 20%, 65%)';
    }
  };

  const getUtilizationRate = () => Math.floor(Math.random() * 40) + 60; // Mock data

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Provider Management</h1>
            <p className="text-muted-foreground">
              Manage your dental practice providers, schedules, and utilization
            </p>
          </div>
          <Button
            onClick={() => setShowAddProvider(true)}
            className="medical-button-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Provider
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Providers</p>
                  <p className="text-2xl font-bold">{providers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <Activity className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                  <p className="text-2xl font-bold">
                    {providers.filter(p => p.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-warning/10 rounded-lg">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Utilization</p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-medical-green/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-medical-green" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Appointments Today</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Provider Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map(provider => (
            <Card key={provider.id} className="patient-card">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" alt={provider.name} />
                    <AvatarFallback 
                      className="text-lg font-semibold"
                      style={{ backgroundColor: `${getProviderTypeColor(provider.provider_type)}20` }}
                    >
                      {provider.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{provider.name}</h3>
                      <Badge 
                        variant={provider.is_active ? "default" : "secondary"}
                        className={provider.is_active ? "status-active" : "status-inactive"}
                      >
                        {provider.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {provider.provider_type}
                    </p>
                    {provider.specialization && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {provider.specialization}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  {provider.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{provider.email}</span>
                    </div>
                  )}
                  {provider.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{provider.phone}</span>
                    </div>
                  )}
                </div>

                {/* Utilization Rate */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Today's Utilization</span>
                    <span className="text-sm font-semibold text-primary">
                      {getUtilizationRate()}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getUtilizationRate()}%` }}
                    />
                  </div>
                </div>

                {/* Working Hours */}
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Working Hours</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Mon-Fri: 8:00 AM - 5:00 PM
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {providers.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Providers Found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first healthcare provider.
              </p>
              <Button onClick={() => setShowAddProvider(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Provider
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add Provider Dialog */}
        <AddProviderDialog
          open={showAddProvider}
          onOpenChange={setShowAddProvider}
        />
      </div>
    </AppLayout>
  );
}