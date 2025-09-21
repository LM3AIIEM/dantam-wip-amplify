import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  CreditCard, 
  MessageSquare,
  Edit,
  Camera,
  UserPlus,
  Activity,
  ClipboardList,
  DollarSign,
  Heart
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { PatientProfile } from '@/types/patient-management';

interface PatientProfileViewProps {
  patient: PatientProfile;
  onEdit: () => void;
  onScheduleAppointment: () => void;
  onSendMessage: () => void;
  onClose: () => void;
}

export function PatientProfileView({ 
  patient, 
  onEdit, 
  onScheduleAppointment, 
  onSendMessage, 
  onClose 
}: PatientProfileViewProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="status-active">Active</Badge>;
      case 'inactive':
        return <Badge className="status-inactive">Inactive</Badge>;
      case 'pending':
        return <Badge className="status-pending">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onClose}>
              ← Back to Directory
            </Button>
            <h1 className="text-2xl font-semibold">Patient Profile</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button onClick={onScheduleAppointment} className="medical-button-primary">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
        </div>

        {/* Patient Header Card */}
        <Card className="patient-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={patient.photo} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {patient.personalInfo.firstName[0]}{patient.personalInfo.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Update Photo
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-semibold">
                      {patient.personalInfo.firstName} {patient.personalInfo.lastName}
                    </h2>
                    {getStatusBadge(patient.status)}
                  </div>
                  <p className="text-muted-foreground">Patient ID: {patient.id}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{patient.personalInfo.phone}</span>
                  </div>
                  
                  {patient.personalInfo.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{patient.personalInfo.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Age: {new Date().getFullYear() - new Date(patient.personalInfo.dateOfBirth).getFullYear()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {patient.personalInfo.address.city}, {patient.personalInfo.address.state}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={onSendMessage}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Link Family Member
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Last Visit</p>
                    <p className="font-medium">{formatDate(patient.lastVisit)}</p>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                    <p className="font-medium text-destructive">
                      {formatCurrency(patient.outstandingBalance)}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="treatments">Treatments</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Stats */}
              <Card className="patient-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Quick Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{patient.appointments?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Appointments</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold text-success">{patient.treatments?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Completed Treatments</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold text-warning">2</p>
                      <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold text-destructive">1</p>
                      <p className="text-sm text-muted-foreground">Overdue Payments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card className="patient-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.emergencyContacts?.contacts.map((contact, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{contact.phone}</p>
                        {contact.isPrimary && (
                          <Badge variant="outline" className="text-xs">Primary</Badge>
                        )}
                      </div>
                    </div>
                  )) || <p className="text-muted-foreground">No emergency contacts on file</p>}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="patient-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                      <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Appointment Completed</p>
                        <p className="text-sm text-muted-foreground">Routine cleaning and examination</p>
                      </div>
                      <span className="text-sm text-muted-foreground">2 days ago</span>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                      <div className="h-8 w-8 bg-success/20 rounded-full flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-success" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Payment Received</p>
                        <p className="text-sm text-muted-foreground">₹2,500 payment processed</p>
                      </div>
                      <span className="text-sm text-muted-foreground">1 week ago</span>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                      <div className="h-8 w-8 bg-warning/20 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-warning" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Medical History Updated</p>
                        <p className="text-sm text-muted-foreground">New allergy information added</p>
                      </div>
                      <span className="text-sm text-muted-foreground">2 weeks ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="patient-card">
                <CardHeader>
                  <CardTitle>Medical Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.medicalHistory?.medicalConditions?.length ? (
                    <div className="space-y-2">
                      {patient.medicalHistory.medicalConditions.map((condition, index) => (
                        <Badge key={index} variant="outline">{condition}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No medical conditions reported</p>
                  )}
                </CardContent>
              </Card>

              <Card className="patient-card">
                <CardHeader>
                  <CardTitle>Allergies</CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.medicalHistory?.allergies?.length ? (
                    <div className="space-y-3">
                      {patient.medicalHistory.allergies.map((allergy, index) => (
                        <div key={index} className="p-3 bg-destructive/10 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{allergy.allergen}</p>
                              <p className="text-sm text-muted-foreground">{allergy.reaction}</p>
                            </div>
                            <Badge 
                              variant={allergy.severity === 'severe' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {allergy.severity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No known allergies</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <Card className="patient-card">
              <CardHeader>
                <CardTitle>Appointment History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Appointment history will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treatments">
            <Card className="patient-card">
              <CardHeader>
                <CardTitle>Treatment History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Treatment history will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="patient-card">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Billing information will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="patient-card">
              <CardHeader>
                <CardTitle>Patient Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Patient documents will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}