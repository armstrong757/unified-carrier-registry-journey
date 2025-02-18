export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      airtable_records: {
        Row: {
          company_name: string | null
          created_at: string | null
          ein: string | null
          email: string | null
          filing_id: string
          filing_type: string
          first_name: string | null
          id: string
          last_name: string | null
          license_url: string | null
          mc_number: string | null
          payment_amount: number | null
          payment_method: string | null
          payment_status: string | null
          phone: string | null
          physical_address: string | null
          registration_year: string | null
          signature_url: string | null
          total_vehicles: number | null
          transaction_id: string | null
          usdot_number: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          ein?: string | null
          email?: string | null
          filing_id: string
          filing_type: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          license_url?: string | null
          mc_number?: string | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          phone?: string | null
          physical_address?: string | null
          registration_year?: string | null
          signature_url?: string | null
          total_vehicles?: number | null
          transaction_id?: string | null
          usdot_number: string
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          ein?: string | null
          email?: string | null
          filing_id?: string
          filing_type?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          license_url?: string | null
          mc_number?: string | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          phone?: string | null
          physical_address?: string | null
          registration_year?: string | null
          signature_url?: string | null
          total_vehicles?: number | null
          transaction_id?: string | null
          usdot_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "airtable_records_filing_id_fkey"
            columns: ["filing_id"]
            isOneToOne: true
            referencedRelation: "filings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "airtable_records_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      api_requests: {
        Row: {
          cache_hit: boolean | null
          created_at: string | null
          error_message: string | null
          filing_id: string | null
          id: string
          request_source: string | null
          request_timestamp: string | null
          request_type: string
          request_url: string | null
          response_status: number | null
          response_time_ms: number | null
          usdot_number: string
        }
        Insert: {
          cache_hit?: boolean | null
          created_at?: string | null
          error_message?: string | null
          filing_id?: string | null
          id?: string
          request_source?: string | null
          request_timestamp?: string | null
          request_type: string
          request_url?: string | null
          response_status?: number | null
          response_time_ms?: number | null
          usdot_number: string
        }
        Update: {
          cache_hit?: boolean | null
          created_at?: string | null
          error_message?: string | null
          filing_id?: string | null
          id?: string
          request_source?: string | null
          request_timestamp?: string | null
          request_type?: string
          request_url?: string | null
          response_status?: number | null
          response_time_ms?: number | null
          usdot_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_requests_filing_id_fkey"
            columns: ["filing_id"]
            isOneToOne: false
            referencedRelation: "filings"
            referencedColumns: ["id"]
          },
        ]
      }
      filings: {
        Row: {
          abandoned_cart_email_sent: boolean | null
          attachments: Json | null
          completed_at: string | null
          created_at: string | null
          email: string | null
          filing_type: Database["public"]["Enums"]["filing_type"]
          flat_form_data: Json | null
          form_data: Json
          id: string
          last_step_completed: number | null
          last_step_timestamp: string | null
          resume_token: string | null
          resume_token_expires_at: string | null
          status: string
          updated_at: string | null
          usdot_number: string
        }
        Insert: {
          abandoned_cart_email_sent?: boolean | null
          attachments?: Json | null
          completed_at?: string | null
          created_at?: string | null
          email?: string | null
          filing_type: Database["public"]["Enums"]["filing_type"]
          flat_form_data?: Json | null
          form_data?: Json
          id?: string
          last_step_completed?: number | null
          last_step_timestamp?: string | null
          resume_token?: string | null
          resume_token_expires_at?: string | null
          status?: string
          updated_at?: string | null
          usdot_number: string
        }
        Update: {
          abandoned_cart_email_sent?: boolean | null
          attachments?: Json | null
          completed_at?: string | null
          created_at?: string | null
          email?: string | null
          filing_type?: Database["public"]["Enums"]["filing_type"]
          flat_form_data?: Json | null
          form_data?: Json
          id?: string
          last_step_completed?: number | null
          last_step_timestamp?: string | null
          resume_token?: string | null
          resume_token_expires_at?: string | null
          status?: string
          updated_at?: string | null
          usdot_number?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          filing_id: string
          id: string
          payment_method: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          filing_id: string
          id?: string
          payment_method?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          filing_id?: string
          id?: string
          payment_method?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_filing_id_fkey"
            columns: ["filing_id"]
            isOneToOne: false
            referencedRelation: "filings"
            referencedColumns: ["id"]
          },
        ]
      }
      usdot_info: {
        Row: {
          basics_data: Json | null
          bus_count: number | null
          complaint_count: number | null
          created_at: string | null
          dba_name: string | null
          drivers: number | null
          ein: string | null
          entity_type: string | null
          id: string
          legal_name: string | null
          limo_count: number | null
          mc_number: string | null
          mcs150_last_update: string | null
          mileage_year: string | null
          minibus_count: number | null
          motorcoach_count: number | null
          operating_status: string | null
          out_of_service: boolean | null
          out_of_service_date: string | null
          physical_address: string | null
          power_units: number | null
          telephone: string | null
          updated_at: string | null
          usdot_number: string
          van_count: number | null
        }
        Insert: {
          basics_data?: Json | null
          bus_count?: number | null
          complaint_count?: number | null
          created_at?: string | null
          dba_name?: string | null
          drivers?: number | null
          ein?: string | null
          entity_type?: string | null
          id?: string
          legal_name?: string | null
          limo_count?: number | null
          mc_number?: string | null
          mcs150_last_update?: string | null
          mileage_year?: string | null
          minibus_count?: number | null
          motorcoach_count?: number | null
          operating_status?: string | null
          out_of_service?: boolean | null
          out_of_service_date?: string | null
          physical_address?: string | null
          power_units?: number | null
          telephone?: string | null
          updated_at?: string | null
          usdot_number: string
          van_count?: number | null
        }
        Update: {
          basics_data?: Json | null
          bus_count?: number | null
          complaint_count?: number | null
          created_at?: string | null
          dba_name?: string | null
          drivers?: number | null
          ein?: string | null
          entity_type?: string | null
          id?: string
          legal_name?: string | null
          limo_count?: number | null
          mc_number?: string | null
          mcs150_last_update?: string | null
          mileage_year?: string | null
          minibus_count?: number | null
          motorcoach_count?: number | null
          operating_status?: string | null
          out_of_service?: boolean | null
          out_of_service_date?: string | null
          physical_address?: string | null
          power_units?: number | null
          telephone?: string | null
          updated_at?: string | null
          usdot_number?: string
          van_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      api_request_analytics: {
        Row: {
          avg_response_time: number | null
          cache_hit_rate: number | null
          time_bucket: string | null
          total_requests: number | null
          unique_dots: number | null
        }
        Relationships: []
      }
      api_request_monitoring: {
        Row: {
          cache_hit: boolean | null
          error_message: string | null
          filing_id: string | null
          request_source: string | null
          request_timestamp: string | null
          request_type: string | null
          requests_per_minute: number | null
          response_status: number | null
          response_time_ms: number | null
          usdot_number: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_requests_filing_id_fkey"
            columns: ["filing_id"]
            isOneToOne: false
            referencedRelation: "filings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_active_draft_filing: {
        Args: {
          p_usdot: string
        }
        Returns: boolean
      }
      check_api_abuse: {
        Args: {
          p_minutes?: number
          p_threshold?: number
        }
        Returns: {
          usdot_number: string
          request_count: number
          request_sources: string[]
          first_request: string
          last_request: string
        }[]
      }
      generate_resume_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_request_statistics: {
        Args: {
          start_time?: string
          end_time?: string
        }
        Returns: {
          total_requests: number
          unique_dots: number
          cache_hit_rate: number
          avg_requests_per_dot: number
        }[]
      }
      migrate_form_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_filing_step: {
        Args: {
          p_current_step: number
          p_new_step: number
          p_filing_type: string
        }
        Returns: boolean
      }
    }
    Enums: {
      filing_type: "ucr" | "mcs150"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
