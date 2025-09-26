import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ProviderLaneCalendar } from '@/components/scheduling/ProviderLaneCalendar';
import { ResourceManagement } from '@/components/scheduling/ResourceManagement';
import { ChairStatusTabs } from '@/components/scheduling/ChairStatusTabs';
import { SchedulingMetrics } from '@/components/scheduling/SchedulingMetrics';
import { TodaysAppointmentsList } from '@/components/scheduling/TodaysAppointmentsList';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Clock, MapPin, Grid3X3, Plus, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Resource } from '@/types/scheduling';

export default function SchedulingPage() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Determine current view based on route
  const getCurrentView = () => {
    if (location.pathname === '/scheduling/resources') return 'resources';
    if (location.pathname === '/scheduling/waitlist') return 'waitlist';
    return 'calendar'; // default to calendar for /scheduling
  };
  
  const currentView = getCurrentView();

  const handleChairClick = (chair: Resource) => {
    // TODO: Open chair schedule modal or navigate to detailed view
    console.log('Chair clicked:', chair);
  };

  const handleQuickBooking = () => {
    // TODO: Open appointment booking modal
    console.log('Quick booking clicked');
  };

  const handleExpandCalendar = () => {
    console.log('Navigate to /scheduling/calendar');
  };

  const handleExpandSchedule = () => {
    console.log('Navigate to /scheduling/schedule');
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
                <ChairStatusTabs onChairClick={handleChairClick} />
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`${sidebarCollapsed ? 'col-span-8' : 'col-span-6'} transition-all duration-300 flex flex-col`}>
            {/* Content based on current route */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                {currentView === 'calendar' && (
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Calendar View</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleExpandCalendar}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      title="Expand calendar view"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {currentView === 'resources' && (
                  <h3 className="text-lg font-semibold text-foreground">Resource Management</h3>
                )}
                {currentView === 'waitlist' && (
                  <h3 className="text-lg font-semibold text-foreground">Wait List Management</h3>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              {currentView === 'calendar' && <ProviderLaneCalendar />}
              {currentView === 'resources' && <ResourceManagement />}
              {currentView === 'waitlist' && (
                <Card className="h-full">
                  <CardContent className="p-6 flex items-center justify-center h-full">
                    <div className="text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Wait List Management</h3>
                      <p className="text-muted-foreground">Coming soon - Wait list functionality</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Sidebar - Today's Appointments */}
          <div className="col-span-3 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Today's Appointments</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExpandSchedule}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                title="Expand schedule view"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
            <TodaysAppointmentsList className="flex-1" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}