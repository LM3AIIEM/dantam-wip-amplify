import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction, PatientBill, FinancialMetrics } from '@/types/financial';
import { toast } from '@/hooks/use-toast';

export function useFinancial() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<PatientBill[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          patient:patients(name)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      
      const formattedTransactions = data?.map(t => ({
        id: t.id,
        patientId: t.patient_id,
        patientName: t.patient?.name || 'Unknown',
        amount: typeof t.amount === 'number' ? t.amount : parseFloat(t.amount),
        paymentMethod: {
          id: t.payment_method,
          name: t.payment_method,
          type: t.payment_method as any,
          isActive: true
        },
        date: t.date,
        description: t.description || '',
        status: t.status as any,
        receiptNumber: t.receipt_number || '',
        notes: t.notes
      })) || [];

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBills = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_bills')
        .select(`
          *,
          patient:patients(name)
        `)
        .order('bill_date', { ascending: false });

      if (error) throw error;
      
      const formattedBills = data?.map(b => ({
        id: b.id,
        patientId: b.patient_id,
        patientName: b.patient?.name || 'Unknown',
        billDate: b.bill_date,
        dueDate: b.due_date,
        totalAmount: typeof b.total_amount === 'number' ? b.total_amount : parseFloat(b.total_amount),
        insuranceAmount: typeof b.insurance_amount === 'number' ? b.insurance_amount : parseFloat(b.insurance_amount || '0'),
        patientAmount: typeof b.patient_amount === 'number' ? b.patient_amount : parseFloat(b.patient_amount),
        paidAmount: typeof b.paid_amount === 'number' ? b.paid_amount : parseFloat(b.paid_amount || '0'),
        balanceAmount: typeof b.balance_amount === 'number' ? b.balance_amount : parseFloat(b.balance_amount),
        status: b.status as any,
        charges: []
      })) || [];

      setBills(formattedBills);
    } catch (error) {
      console.error('Error loading bills:', error);
      toast({
        title: "Error",
        description: "Failed to load bills",
        variant: "destructive"
      });
    }
  };

  const calculateMetrics = async () => {
    try {
      // Get transactions for metrics calculation
      const { data: transactionData, error } = await supabase
        .from('transactions')
        .select('amount, date')
        .eq('status', 'completed');

      if (error) throw error;

      const transactions = transactionData || [];
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Calculate daily revenue (today)
      const today = new Date().toISOString().split('T')[0];
      const dailyRevenue = transactions
        .filter(t => t.date.startsWith(today))
        .reduce((sum, t) => sum + (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount)), 0);

      // Calculate monthly revenue
      const monthlyRevenue = transactions
        .filter(t => {
          const date = new Date(t.date);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount)), 0);

      // Calculate yearly revenue
      const yearlyRevenue = transactions
        .filter(t => new Date(t.date).getFullYear() === currentYear)
        .reduce((sum, t) => sum + (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount)), 0);

      // Calculate average transaction
      const averageTransaction = transactions.length > 0 
        ? transactions.reduce((sum, t) => sum + (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount)), 0) / transactions.length 
        : 0;

      // Get outstanding balance from bills
      const { data: billData } = await supabase
        .from('patient_bills')
        .select('balance_amount')
        .neq('status', 'paid');

      const outstandingBalance = billData?.reduce((sum, b) => sum + (typeof b.balance_amount === 'number' ? b.balance_amount : parseFloat(b.balance_amount)), 0) || 0;

      setMetrics({
        dailyRevenue,
        monthlyRevenue,
        yearlyRevenue,
        averageTransaction,
        collectionRate: 85, // This would need more complex calculation
        outstandingBalance
      });
    } catch (error) {
      console.error('Error calculating metrics:', error);
    }
  };

  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'patientName'>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('transactions')
        .insert({
          patient_id: transactionData.patientId,
          amount: transactionData.amount,
          payment_method: transactionData.paymentMethod.type,
          description: transactionData.description,
          status: transactionData.status,
          receipt_number: transactionData.receiptNumber,
          notes: transactionData.notes
        });

      if (error) throw error;
      
      await loadTransactions();
      await calculateMetrics();
      
      toast({
        title: "Success",
        description: "Transaction created successfully"
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to create transaction",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createBill = async (billData: Omit<PatientBill, 'id' | 'patientName'>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('patient_bills')
        .insert({
          patient_id: billData.patientId,
          bill_date: billData.billDate,
          due_date: billData.dueDate,
          total_amount: billData.totalAmount,
          insurance_amount: billData.insuranceAmount,
          patient_amount: billData.patientAmount,
          paid_amount: billData.paidAmount,
          balance_amount: billData.balanceAmount,
          status: billData.status
        });

      if (error) throw error;
      
      await loadBills();
      
      toast({
        title: "Success",
        description: "Bill created successfully"
      });
    } catch (error) {
      console.error('Error creating bill:', error);
      toast({
        title: "Error",
        description: "Failed to create bill",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
    loadBills();
    calculateMetrics();

    // Set up real-time subscriptions
    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions'
      }, () => {
        loadTransactions();
        calculateMetrics();
      })
      .subscribe();

    const billsChannel = supabase
      .channel('bills-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'patient_bills'
      }, () => {
        loadBills();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(billsChannel);
    };
  }, []);

  return {
    transactions,
    bills,
    metrics,
    loading,
    createTransaction,
    createBill,
    loadTransactions,
    loadBills
  };
}