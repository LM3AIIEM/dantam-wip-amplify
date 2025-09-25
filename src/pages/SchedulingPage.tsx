import { useState } from 'react';
import { ProviderLaneCalendar } from '@/components/scheduling/ProviderLaneCalendar';
import { ResourceManagement } from '@/components/scheduling/ResourceManagement';
import { ChairStatusPanel } from '@/components/scheduling/ChairStatusPanel';
import { SchedulingMetrics } from '@/components/scheduling/SchedulingMetrics';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Clock, MapPin, Grid3X3 } from 'lucide-react';
import { Resource } from '@/types/scheduling';

export default function SchedulingPage() {
  const [activeView, setActiveView] = useState('calendar');

  const handleChairClick = (chair: Resource) => {
    // TODO: Open chair schedule modal or navigate to detailed view
    console.log('Chair clicked:', chair);
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Scheduling', isCurrentPage: true }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Scheduling Management</h1>
            <p className="text-muted-foreground">
              Manage appointments, providers, and resources efficiently
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/providers">
                <Users className="h-4 w-4 mr-2" />
                Manage Providers
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/wait-list">
                <Clock className="h-4 w-4 mr-2" />
                Wait List
              </a>
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <SchedulingMetrics />

        {/* View Tabs */}
        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Provider Calendar
            </TabsTrigger>
            <TabsTrigger value="chairs" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Chair Status
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Resource View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <ProviderLaneCalendar />
          </TabsContent>

          <TabsContent value="chairs">
            <ChairStatusPanel onChairClick={handleChairClick} />
          </TabsContent>

          <TabsContent value="resources">
            <ResourceManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}