import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessagingHub } from '@/components/communications/MessagingHub';
import { ReminderManagement } from '@/components/communications/ReminderManagement';
import { RecallCampaigns } from '@/components/communications/RecallCampaigns';
import { PatientPortal } from '@/components/communications/PatientPortal';
import { CommunicationAnalyticsDashboard } from '@/components/communications/CommunicationAnalytics';

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState('messaging');

  const breadcrumbs = [
    { title: 'Patient Communications', isCurrentPage: true }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Communications</h1>
            <p className="text-muted-foreground">
              Multi-channel messaging, automated reminders, and patient engagement tools
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="messaging">Messaging Hub</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="recalls">Recall Campaigns</TabsTrigger>
            <TabsTrigger value="portal">Patient Portal</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="messaging" className="space-y-6">
            <MessagingHub />
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
            <ReminderManagement />
          </TabsContent>

          <TabsContent value="recalls" className="space-y-6">
            <RecallCampaigns />
          </TabsContent>

          <TabsContent value="portal" className="space-y-6">
            <PatientPortal />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <CommunicationAnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}