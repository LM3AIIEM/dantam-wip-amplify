import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  Search, 
  Filter,
  Bell,
  Calendar,
  User,
  Phone,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useScheduling } from '@/hooks/useScheduling';

export default function WaitListPage() {
  const { providers, appointmentTypes } = useScheduling();
  const [searchTerm, setSearchTerm] = useState('');

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Scheduling', href: '/scheduling' },
    { title: 'Wait List', isCurrentPage: true }
  ];

  // Mock wait list data
  const waitListEntries = [
    {
      id: '1',
      patient: { name: 'Sarah Johnson', phone: '(555) 123-4567' },
      appointmentType: 'Cleaning',
      provider: 'Dr. Smith',
      preferredDate: '2024-01-25',
      preferredTime: '10:00 AM - 12:00 PM',
      priority: 'routine',
      waitingSince: '2024-01-20',
      isNotified: false
    },
    {
      id: '2',
      patient: { name: 'Michael Brown', phone: '(555) 234-5678' },
      appointmentType: 'Emergency',
      provider: 'Any Available',
      preferredDate: 'ASAP',
      preferredTime: 'Any',
      priority: 'urgent',
      waitingSince: '2024-01-23',
      isNotified: true
    },
    {
      id: '3',
      patient: { name: 'Emma Davis', phone: '(555) 345-6789' },
      appointmentType: 'Consultation',
      provider: 'Dr. Wilson',
      preferredDate: '2024-01-30',
      preferredTime: '2:00 PM - 4:00 PM',
      priority: 'flexible',
      waitingSince: '2024-01-19',
      isNotified: false
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'routine': return 'bg-warning/10 text-warning border-warning/20';
      case 'flexible': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="h-3 w-3" />;
      case 'routine': return <Clock className="h-3 w-3" />;
      case 'flexible': return <CheckCircle2 className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const filteredEntries = waitListEntries.filter(entry =>
    entry.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.appointmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Wait List Management</h1>
            <p className="text-muted-foreground">
              Manage patient waiting list and automatic notifications
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Waiting</p>
                  <p className="text-2xl font-bold">{waitListEntries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Urgent</p>
                  <p className="text-2xl font-bold">
                    {waitListEntries.filter(e => e.priority === 'urgent').length}
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
                  <p className="text-sm text-muted-foreground">Routine</p>
                  <p className="text-2xl font-bold">
                    {waitListEntries.filter(e => e.priority === 'routine').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <Bell className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Notified</p>
                  <p className="text-2xl font-bold">
                    {waitListEntries.filter(e => e.isNotified).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, appointment type, or provider..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wait List Table */}
        <Card>
          <CardHeader>
            <CardTitle>Wait List Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEntries.map(entry => (
                <div
                  key={entry.id}
                  className="p-4 border rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {/* Patient Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3">
                        <User className="h-8 w-8 p-2 bg-primary/10 rounded-full text-primary" />
                        <div>
                          <h3 className="font-semibold">{entry.patient.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {entry.patient.phone}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div>
                      <div className="text-sm font-medium">{entry.appointmentType}</div>
                      <div className="text-xs text-muted-foreground">{entry.provider}</div>
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {entry.preferredDate}
                      </div>
                      <div className="text-xs text-muted-foreground">{entry.preferredTime}</div>
                    </div>

                    {/* Priority */}
                    <div>
                      <Badge className={`${getPriorityColor(entry.priority)} capitalize`}>
                        {getPriorityIcon(entry.priority)}
                        <span className="ml-1">{entry.priority}</span>
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        Since {new Date(entry.waitingSince).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline">
                        Schedule
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={entry.isNotified}
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        {entry.isNotified ? 'Notified' : 'Notify'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredEntries.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Wait List Entries</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'No entries match your search criteria.' : 'The wait list is currently empty.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}