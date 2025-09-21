export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointment_types: {
        Row: {
          appointment_type: Database["public"]["Enums"]["appointment_type"]
          color: string
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          name: string
          requires_resources: string[] | null
        }
        Insert: {
          appointment_type: Database["public"]["Enums"]["appointment_type"]
          color?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          name: string
          requires_resources?: string[] | null
        }
        Update: {
          appointment_type?: Database["public"]["Enums"]["appointment_type"]
          color?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          name?: string
          requires_resources?: string[] | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_type_id: string
          created_at: string
          created_by: string | null
          end_time: string
          id: string
          is_recurring: boolean
          notes: string | null
          patient_id: string
          provider_id: string
          recurring_pattern: Json | null
          resource_id: string | null
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
        }
        Insert: {
          appointment_type_id: string
          created_at?: string
          created_by?: string | null
          end_time: string
          id?: string
          is_recurring?: boolean
          notes?: string | null
          patient_id: string
          provider_id: string
          recurring_pattern?: Json | null
          resource_id?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Update: {
          appointment_type_id?: string
          created_at?: string
          created_by?: string | null
          end_time?: string
          id?: string
          is_recurring?: boolean
          notes?: string | null
          patient_id?: string
          provider_id?: string
          recurring_pattern?: Json | null
          resource_id?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_appointment_type_id_fkey"
            columns: ["appointment_type_id"]
            isOneToOne: false
            referencedRelation: "appointment_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          barcode: string | null
          category: string
          created_at: string
          current_stock: number
          description: string | null
          expiration_date: string | null
          id: string
          is_active: boolean
          last_restocked: string | null
          location: string | null
          max_stock: number | null
          name: string
          reorder_point: number
          sku: string
          total_value: number | null
          unit_cost: number | null
          unit_of_measure: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          barcode?: string | null
          category: string
          created_at?: string
          current_stock?: number
          description?: string | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean
          last_restocked?: string | null
          location?: string | null
          max_stock?: number | null
          name: string
          reorder_point?: number
          sku: string
          total_value?: number | null
          unit_cost?: number | null
          unit_of_measure: string
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          barcode?: string | null
          category?: string
          created_at?: string
          current_stock?: number
          description?: string | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean
          last_restocked?: string | null
          location?: string | null
          max_stock?: number | null
          name?: string
          reorder_point?: number
          sku?: string
          total_value?: number | null
          unit_cost?: number | null
          unit_of_measure?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: []
      }
      patient_bills: {
        Row: {
          balance_amount: number
          bill_date: string
          created_at: string
          due_date: string | null
          id: string
          insurance_amount: number | null
          paid_amount: number | null
          patient_amount: number
          patient_id: string
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          balance_amount: number
          bill_date?: string
          created_at?: string
          due_date?: string | null
          id?: string
          insurance_amount?: number | null
          paid_amount?: number | null
          patient_amount: number
          patient_id: string
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          balance_amount?: number
          bill_date?: string
          created_at?: string
          due_date?: string | null
          id?: string
          insurance_amount?: number | null
          paid_amount?: number | null
          patient_amount?: number
          patient_id?: string
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_bills_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_communications: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          direction: string
          id: string
          patient_id: string
          status: string
          type: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          direction: string
          id?: string
          patient_id: string
          status?: string
          type: string
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          direction?: string
          id?: string
          patient_id?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_communications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_documents: {
        Row: {
          file_size: number | null
          id: string
          name: string
          patient_id: string
          type: string
          upload_date: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          file_size?: number | null
          id?: string
          name: string
          patient_id: string
          type: string
          upload_date?: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          file_size?: number | null
          id?: string
          name?: string
          patient_id?: string
          type?: string
          upload_date?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_profiles: {
        Row: {
          address: Json | null
          created_at: string
          first_name: string | null
          gender: string | null
          id: string
          insurance_info: Json | null
          last_name: string | null
          medical_history: Json | null
          patient_id: string
          updated_at: string
        }
        Insert: {
          address?: Json | null
          created_at?: string
          first_name?: string | null
          gender?: string | null
          id?: string
          insurance_info?: Json | null
          last_name?: string | null
          medical_history?: Json | null
          patient_id: string
          updated_at?: string
        }
        Update: {
          address?: Json | null
          created_at?: string
          first_name?: string | null
          gender?: string | null
          id?: string
          insurance_info?: Json | null
          last_name?: string | null
          medical_history?: Json | null
          patient_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_profiles_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          id: string
          insurance: string | null
          last_visit: string | null
          medical_record_number: string | null
          name: string
          phone: string | null
          primary_physician: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          id?: string
          insurance?: string | null
          last_visit?: string | null
          medical_record_number?: string | null
          name: string
          phone?: string | null
          primary_physician?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          id?: string
          insurance?: string | null
          last_visit?: string | null
          medical_record_number?: string | null
          name?: string
          phone?: string | null
          primary_physician?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          clinic_id: string | null
          created_at: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          clinic_id?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          clinic_id?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      provider_schedules: {
        Row: {
          break_end_time: string | null
          break_start_time: string | null
          created_at: string
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          end_time: string
          id: string
          is_available: boolean
          provider_id: string
          start_time: string
        }
        Insert: {
          break_end_time?: string | null
          break_start_time?: string | null
          created_at?: string
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          end_time: string
          id?: string
          is_available?: boolean
          provider_id: string
          start_time: string
        }
        Update: {
          break_end_time?: string | null
          break_start_time?: string | null
          created_at?: string
          day_of_week?: Database["public"]["Enums"]["day_of_week"]
          end_time?: string
          id?: string
          is_available?: boolean
          provider_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_schedules_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_time_off: {
        Row: {
          created_at: string
          end_time: string
          id: string
          is_recurring: boolean
          provider_id: string
          reason: string | null
          recurring_pattern: Json | null
          start_time: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          is_recurring?: boolean
          provider_id: string
          reason?: string | null
          recurring_pattern?: Json | null
          start_time: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          is_recurring?: boolean
          provider_id?: string
          reason?: string | null
          recurring_pattern?: Json | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_time_off_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          license_number: string | null
          name: string
          phone: string | null
          provider_type: Database["public"]["Enums"]["provider_type"]
          specialization: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          license_number?: string | null
          name: string
          phone?: string | null
          provider_type?: Database["public"]["Enums"]["provider_type"]
          specialization?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          license_number?: string | null
          name?: string
          phone?: string | null
          provider_type?: Database["public"]["Enums"]["provider_type"]
          specialization?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_available: boolean
          maintenance_schedule: Json | null
          name: string
          resource_type: Database["public"]["Enums"]["resource_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean
          maintenance_schedule?: Json | null
          name: string
          resource_type: Database["public"]["Enums"]["resource_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean
          maintenance_schedule?: Json | null
          name?: string
          resource_type?: Database["public"]["Enums"]["resource_type"]
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_by: string | null
          date: string
          description: string | null
          id: string
          notes: string | null
          patient_id: string
          payment_method: string
          receipt_number: string | null
          status: string
        }
        Insert: {
          amount: number
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          payment_method: string
          receipt_number?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          payment_method?: string
          receipt_number?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          cost: number | null
          created_at: string
          date_performed: string | null
          description: string | null
          id: string
          name: string
          notes: string | null
          patient_id: string
          provider_id: string
          status: string
          updated_at: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          date_performed?: string | null
          description?: string | null
          id?: string
          name: string
          notes?: string | null
          patient_id: string
          provider_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          date_performed?: string | null
          description?: string | null
          id?: string
          name?: string
          notes?: string | null
          patient_id?: string
          provider_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          delivery_time: number | null
          email: string | null
          id: string
          is_active: boolean
          last_order_date: string | null
          name: string
          payment_terms: string | null
          phone: string | null
          rating: number | null
          total_order_value: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          delivery_time?: number | null
          email?: string | null
          id?: string
          is_active?: boolean
          last_order_date?: string | null
          name: string
          payment_terms?: string | null
          phone?: string | null
          rating?: number | null
          total_order_value?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          delivery_time?: number | null
          email?: string | null
          id?: string
          is_active?: boolean
          last_order_date?: string | null
          name?: string
          payment_terms?: string | null
          phone?: string | null
          rating?: number | null
          total_order_value?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      wait_list: {
        Row: {
          appointment_type_id: string
          created_at: string
          expires_at: string | null
          id: string
          is_notified: boolean
          notes: string | null
          patient_id: string
          preferred_date: string | null
          preferred_time_end: string | null
          preferred_time_start: string | null
          priority: number
          provider_id: string | null
        }
        Insert: {
          appointment_type_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_notified?: boolean
          notes?: string | null
          patient_id: string
          preferred_date?: string | null
          preferred_time_end?: string | null
          preferred_time_start?: string | null
          priority?: number
          provider_id?: string | null
        }
        Update: {
          appointment_type_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_notified?: boolean
          notes?: string | null
          patient_id?: string
          preferred_date?: string | null
          preferred_time_end?: string | null
          preferred_time_start?: string | null
          priority?: number
          provider_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wait_list_appointment_type_id_fkey"
            columns: ["appointment_type_id"]
            isOneToOne: false
            referencedRelation: "appointment_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wait_list_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "checked_in"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
      appointment_type:
        | "consultation"
        | "cleaning"
        | "filling"
        | "extraction"
        | "root_canal"
        | "crown"
        | "checkup"
        | "emergency"
      day_of_week:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
      provider_type: "dentist" | "hygienist" | "specialist" | "assistant"
      resource_type: "chair" | "operatory" | "equipment" | "room"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: [
        "scheduled",
        "confirmed",
        "checked_in",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ],
      appointment_type: [
        "consultation",
        "cleaning",
        "filling",
        "extraction",
        "root_canal",
        "crown",
        "checkup",
        "emergency",
      ],
      day_of_week: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      provider_type: ["dentist", "hygienist", "specialist", "assistant"],
      resource_type: ["chair", "operatory", "equipment", "room"],
    },
  },
} as const
