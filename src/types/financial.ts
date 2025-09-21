export interface FinancialMetrics {
  dailyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  averageTransaction: number;
  collectionRate: number;
  outstandingBalance: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'check' | 'credit_card' | 'ach' | 'insurance';
  isActive: boolean;
}

export interface Transaction {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  receiptNumber: string;
  notes?: string;
}

export interface TreatmentCharge {
  id: string;
  treatmentCode: string;
  treatmentName: string;
  providerFee: number;
  insuranceCoverage: number;
  patientPortion: number;
  quantity: number;
  total: number;
}

export interface PatientBill {
  id: string;
  patientId: string;
  patientName: string;
  billDate: string;
  dueDate: string;
  totalAmount: number;
  insuranceAmount: number;
  patientAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'draft' | 'sent' | 'overdue' | 'paid' | 'partial';
  charges: TreatmentCharge[];
}

export interface PaymentPlan {
  id: string;
  patientId: string;
  totalAmount: number;
  monthlyPayment: number;
  startDate: string;
  endDate: string;
  remainingBalance: number;
  status: 'active' | 'completed' | 'defaulted';
  autoPayEnabled: boolean;
  paymentMethod?: PaymentMethod;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  planType: string;
  deductible: number;
  annualMaximum: number;
  preventiveCoverage: number;
  basicCoverage: number;
  majorCoverage: number;
  ortoCoverage: number;
  isActive: boolean;
}

export interface InsuranceClaim {
  id: string;
  patientId: string;
  providerId: string;
  insuranceProvider: InsuranceProvider;
  claimDate: string;
  serviceDate: string;
  totalAmount: number;
  approvedAmount: number;
  paidAmount: number;
  status: 'submitted' | 'pending' | 'approved' | 'denied' | 'paid';
  denialReason?: string;
  resubmissionDate?: string;
}

export interface FinancialReport {
  id: string;
  name: string;
  type: 'profit_loss' | 'cash_flow' | 'collections' | 'productivity' | 'insurance_analysis';
  dateRange: {
    start: string;
    end: string;
  };
  parameters: Record<string, any>;
  generatedDate: string;
  data: any;
}

export interface AgingReport {
  current: number; // 0-30 days
  thirty: number;   // 31-60 days
  sixty: number;    // 61-90 days
  ninety: number;   // 91+ days
  total: number;
}

export type FinancialFilters = {
  dateRange: {
    start: string;
    end: string;
  };
  paymentMethod?: string;
  provider?: string;
  insuranceProvider?: string;
  status?: string;
};