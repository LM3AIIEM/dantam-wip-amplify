import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/patient';
import { PatientRegistration } from '@/types/patient-management';
import { toast } from '@/hooks/use-toast';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform database data to Patient interface
      const transformedPatients = data?.map(patient => ({
        id: patient.id,
        name: patient.name,
        phone: patient.phone || '',
        email: patient.email || '',
        dateOfBirth: patient.date_of_birth || '',
        lastVisit: patient.last_visit || '',
        status: patient.status as 'active' | 'inactive' | 'pending' | 'discharged',
        insurance: patient.insurance || '',
        primaryPhysician: patient.primary_physician || '',
        medicalRecordNumber: patient.medical_record_number || '',
        emergencyContact: {
          name: patient.emergency_contact_name || '',
          phone: patient.emergency_contact_phone || '',
          relationship: patient.emergency_contact_relationship || ''
        }
      })) || [];
      
      setPatients(transformedPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (patientData: PatientRegistration) => {
    try {
      setLoading(true);
      
      // Create main patient record
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          name: `${patientData.personalInfo.firstName} ${patientData.personalInfo.lastName}`,
          phone: patientData.personalInfo.phone,
          email: patientData.personalInfo.email,
          date_of_birth: patientData.personalInfo.dateOfBirth.toISOString().split('T')[0],
          medical_record_number: `MRN-${Date.now()}`,
          emergency_contact_name: patientData.emergencyContacts.contacts[0]?.name,
          emergency_contact_phone: patientData.emergencyContacts.contacts[0]?.phone,
          emergency_contact_relationship: patientData.emergencyContacts.contacts[0]?.relationship,
        })
        .select()
        .single();

      if (patientError) throw patientError;

      // Create detailed profile
      const { error: profileError } = await supabase
        .from('patient_profiles')
        .insert({
          patient_id: patient.id,
          first_name: patientData.personalInfo.firstName,
          last_name: patientData.personalInfo.lastName,
          gender: patientData.personalInfo.gender,
          address: JSON.stringify(patientData.personalInfo.address),
          medical_history: JSON.stringify(patientData.medicalHistory),
          insurance_info: JSON.stringify(patientData.insuranceInfo),
        });

      if (profileError) throw profileError;

      await loadPatients();
      toast({
        title: "Success",
        description: "Patient created successfully"
      });

      return patient;
    } catch (error) {
      console.error('Error creating patient:', error);
      toast({
        title: "Error",
        description: "Failed to create patient",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await loadPatients();
      toast({
        title: "Success",
        description: "Patient updated successfully"
      });
    } catch (error) {
      console.error('Error updating patient:', error);
      toast({
        title: "Error",
        description: "Failed to update patient",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPatients(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Patient deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getPatientById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          patient_profiles(*),
          patient_documents(*),
          patient_communications(*),
          treatments(*),
          transactions(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadPatients();

    // Set up real-time subscription
    const channel = supabase
      .channel('patients-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'patients'
      }, () => {
        loadPatients();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    patients,
    loading,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    loadPatients
  };
}