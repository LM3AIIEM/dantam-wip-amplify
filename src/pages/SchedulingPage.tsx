import { useState } from 'react';
import { ProviderLaneCalendar } from '@/components/scheduling/ProviderLaneCalendar';
import { ResourceManagement } from '@/components/scheduling/ResourceManagement';
import { ChairStatusPanel } from '@/components/scheduling/ChairStatusPanel';
import { SchedulingMetrics } from '@/components/scheduling/SchedulingMetrics';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Clock, MapPin, Grid3X3, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Resource } from '@/types/scheduling';

export default function SchedulingPage() {
  const [activeView, setActiveView] = useState('calendar');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleChairClick = (chair: Resource) => {
    // TODO: Open chair schedule modal or navigate to detailed view
    console.log('Chair clicked:', chair);
  };

  const handleQuickBooking = () => {
    // TODO: Open appointment booking modal
    console.log('Quick booking clicked');
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Scheduling', isCurrentPage: true }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Scheduling Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive view of appointments, providers, and resources
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleQuickBooking} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Quick Book
            </Button>
            <Button variant="outline" asChild>
              <a href="/providers">
                <Users className="h-4 w-4 mr-2" />
                Providers
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
        <div className="p-6 border-b">
          <SchedulingMetrics />
        </div>

        {/* Main Dashboard Grid */}
        <div className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden">
          {/* Left Sidebar - Chair Status Panel */}
          <div className={`${sidebarCollapsed ? 'col-span-1' : 'col-span-3'} transition-all duration-300 flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              {!sidebarCollapsed && (
                <h3 className="text-lg font-semibold text-foreground">Chair Status</h3>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-8 w-8 p-0"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex-1 overflow-auto">
              {sidebarCollapsed ? (
                <div className="space-y-2">
                  {/* Compact chair indicators when collapsed */}
                  <div className="grid grid-cols-1 gap-1">
                    {[1, 2, 3, 4, 5, 6].map((chair) => (
                      <div
                        key={chair}
                        className="w-8 h-8 rounded border-2 border-success bg-success/10 flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-success/20 transition-colors"
                        title={`Chair ${chair} - Available`}
                      >
                        {chair}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <ChairStatusPanel onChairClick={handleChairClick} />
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`${sidebarCollapsed ? 'col-span-8' : 'col-span-6'} transition-all duration-300 flex flex-col`}>
            {/* Calendar View Tabs */}
            <Tabs value={activeView} onValueChange={setActiveView} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Resources
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="flex-1 mt-4">
                <ProviderLaneCalendar />
              </TabsContent>

              <TabsContent value="timeline" className="flex-1 mt-4">
                <Card className="h-full">
                  <CardContent className="p-6 flex items-center justify-center h-full">
                    <div className="text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Timeline View</h3>
                      <p className="text-muted-foreground">Coming soon - Detailed timeline view of appointments</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="flex-1 mt-4">
                <ResourceManagement />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Quick Actions */}
          <div className="col-span-3 flex flex-col">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            
            <div className="space-y-4">
              {/* Today's Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Today's Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Appointments</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-medium text-success">18</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-medium text-warning">6</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleQuickBooking}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Appointment
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Emergency Slot
                  </Button>
                </CardContent>
              </Card>

              {/* Waiting List Preview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Waiting List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-2xl font-bold text-warning">3</div>
                    <p className="text-xs text-muted-foreground">patients waiting</p>
                    <Button variant="link" size="sm" className="mt-2 h-auto p-0" asChild>
                      <a href="/wait-list">View all</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}