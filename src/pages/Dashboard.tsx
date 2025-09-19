import React from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Clock,
  UserCheck,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Mock data for dashboard metrics
const dashboardMetrics = {
  patients: {
    total: 1247,
    new: 23,
    change: '+12%',
    trend: 'up' as const,
  },
  appointments: {
    today: 18,
    total: 145,
    change: '+8%',
    trend: 'up' as const,
  },
  revenue: {
    today: 12450,
    monthly: 89230,
    change: '+15%',
    trend: 'up' as const,
  },
  utilization: {
    rate: 87,
    change: '+3%',
    trend: 'up' as const,
  },
};

const todayAppointments = [
  { id: '1', patient: 'Sarah Johnson', time: '9:00 AM', type: 'Cleaning', status: 'confirmed' },
  { id: '2', patient: 'Michael Chen', time: '10:30 AM', type: 'Root Canal', status: 'in-progress' },
  { id: '3', patient: 'Emily Davis', time: '2:00 PM', type: 'Consultation', status: 'waiting' },
  { id: '4', patient: 'Robert Wilson', time: '3:30 PM', type: 'Filling', status: 'confirmed' },
  { id: '5', patient: 'Lisa Anderson', time: '4:00 PM', type: 'Check-up', status: 'pending' },
];

const recentPatients = [
  { id: '1', name: 'Alex Thompson', lastVisit: '2024-01-15', status: 'active', nextAppointment: '2024-02-15' },
  { id: '2', name: 'Maria Garcia', lastVisit: '2024-01-14', status: 'active', nextAppointment: '2024-03-14' },
  { id: '3', name: 'David Kim', lastVisit: '2024-01-12', status: 'pending', nextAppointment: null },
  { id: '4', name: 'Jennifer Brown', lastVisit: '2024-01-10', status: 'active', nextAppointment: '2024-04-10' },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'in-progress':
      return <Activity className="h-4 w-4 text-primary" />;
    case 'waiting':
      return <Clock className="h-4 w-4 text-warning" />;
    case 'pending':
      return <AlertCircle className="h-4 w-4 text-warning" />;
    default:
      return <UserCheck className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge className="status-active">Confirmed</Badge>;
    case 'in-progress':
      return <Badge variant="default">In Progress</Badge>;
    case 'waiting':
      return <Badge className="status-pending">Waiting</Badge>;
    case 'pending':
      return <Badge className="status-pending">Pending</Badge>;
    case 'active':
      return <Badge className="status-active">Active</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening at your clinic today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button className="medical-button-primary">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="patient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.patients.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-success" />
              <span className="text-success">{dashboardMetrics.patients.change}</span>
              <span className="ml-1">+{dashboardMetrics.patients.new} new this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="patient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.appointments.today}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-success" />
              <span className="text-success">{dashboardMetrics.appointments.change}</span>
              <span className="ml-1">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="patient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{dashboardMetrics.revenue.today.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-success" />
              <span className="text-success">{dashboardMetrics.revenue.change}</span>
              <span className="ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="patient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chair Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.utilization.rate}%</div>
            <Progress value={dashboardMetrics.utilization.rate} className="mt-2" />
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <TrendingUp className="h-3 w-3 mr-1 text-success" />
              <span className="text-success">{dashboardMetrics.utilization.change}</span>
              <span className="ml-1">vs last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Appointments */}
        <Card className="patient-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Today's Schedule</span>
              <Badge variant="outline">{todayAppointments.length} appointments</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(appointment.status)}
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.time} • {appointment.type}
                    </p>
                  </div>
                </div>
                {getStatusBadge(appointment.status)}
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              View Full Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card className="patient-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Patients</span>
              <Badge variant="outline">{recentPatients.length} patients</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(patient.status)}
                  {patient.nextAppointment && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              View All Patients
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="patient-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex flex-col gap-2 medical-button-primary">
              <Users className="h-6 w-6" />
              <span>Add New Patient</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span>Schedule Appointment</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <DollarSign className="h-6 w-6" />
              <span>Process Payment</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Activity className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}