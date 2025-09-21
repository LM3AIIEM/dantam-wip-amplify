import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinancialDashboard } from '@/components/financial/FinancialDashboard';
import { PatientBilling } from '@/components/financial/PatientBilling';
import { PaymentProcessing } from '@/components/financial/PaymentProcessing';
import { InsuranceManagement } from '@/components/financial/InsuranceManagement';
import { FinancialReports } from '@/components/financial/FinancialReports';
import { FinancialMetrics, AgingReport } from '@/types/financial';
import { useFinancial } from '@/hooks/useFinancial';

// Mock data for demonstration
const mockMetrics: FinancialMetrics = {
  dailyRevenue: 3250.00,
  monthlyRevenue: 67500.00,
  yearlyRevenue: 450000.00,
  averageTransaction: 285.50,
  collectionRate: 94.5,
  outstandingBalance: 15650.00
};

const mockAgingReport: AgingReport = {
  current: 8500.00,   // 0-30 days
  thirty: 4200.00,    // 31-60 days
  sixty: 2150.00,     // 61-90 days
  ninety: 800.00,     // 91+ days
  total: 15650.00
};

export default function FinancialPage() {
  const { metrics, loading } = useFinancial();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Default aging report structure
  const agingReport: AgingReport = {
    current: 5670.00,
    thirty: 3240.00,
    sixty: 2100.00,
    ninety: 1340.00,
    total: 12350.00
  };

  const breadcrumbs = [
    { title: 'Financial Management', isCurrentPage: true }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
            <p className="text-muted-foreground">
              Comprehensive financial dashboard, billing, and reporting system
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="billing">Patient Billing</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <FinancialDashboard 
              metrics={metrics || {
                dailyRevenue: 0,
                monthlyRevenue: 0,
                yearlyRevenue: 0,
                averageTransaction: 0,
                collectionRate: 0,
                outstandingBalance: 0
              }} 
              agingReport={agingReport} 
            />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <PatientBilling />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentProcessing />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <FinancialReports />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
