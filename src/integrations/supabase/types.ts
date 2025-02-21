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
      mcs150_airtable_records: {
        Row: {
          address_modified: boolean | null
          cargo_agricultural: boolean | null
          cargo_beverages: boolean | null
          cargo_building_materials: boolean | null
          cargo_chemicals: boolean | null
          cargo_coal: boolean | null
          cargo_commodities_dry_bulk: boolean | null
          cargo_construction: boolean | null
          cargo_drive_away: boolean | null
          cargo_fresh_produce: boolean | null
          cargo_garbage: boolean | null
          cargo_general_freight: boolean | null
          cargo_grain: boolean | null
          cargo_household_goods: boolean | null
          cargo_intermodal_containers: boolean | null
          cargo_liquids_gases: boolean | null
          cargo_livestock: boolean | null
          cargo_logs: boolean | null
          cargo_machinery: boolean | null
          cargo_meat: boolean | null
          cargo_metal_sheets: boolean | null
          cargo_mobile_homes: boolean | null
          cargo_motor_vehicles: boolean | null
          cargo_oilfield_equipment: boolean | null
          cargo_other: boolean | null
          cargo_paper_products: boolean | null
          cargo_passengers: boolean | null
          cargo_refrigerated_food: boolean | null
          cargo_us_mail: boolean | null
          cargo_utilities: boolean | null
          cargo_water_well: boolean | null
          changes_to_make: Json | null
          classification_authorized_for_hire: boolean | null
          classification_exempt_for_hire: boolean | null
          classification_federal_government: boolean | null
          classification_indian_tribe: boolean | null
          classification_local_government: boolean | null
          classification_migrant: boolean | null
          classification_private_passengers_business: boolean | null
          classification_private_passengers_non_business: boolean | null
          classification_private_property: boolean | null
          classification_state_government: boolean | null
          classification_us_mail: boolean | null
          company_ein: string | null
          company_email: string | null
          company_info_changes: Json | null
          company_owner_name: string | null
          company_phone: string | null
          company_ssn: string | null
          created_at: string | null
          filing_id: string
          filing_type: string
          form_mailing_address_city: string | null
          form_mailing_address_country: string | null
          form_mailing_address_state: string | null
          form_mailing_address_street: string | null
          form_mailing_address_zip: string | null
          form_physical_address_city: string | null
          form_physical_address_country: string | null
          form_physical_address_state: string | null
          form_physical_address_street: string | null
          form_physical_address_zip: string | null
          has_changes: boolean | null
          id: string
          license_url: string | null
          mailing_address_city: string | null
          mailing_address_country: string | null
          mailing_address_state: string | null
          mailing_address_street: string | null
          mailing_address_zip: string | null
          operating_info_changes: Json | null
          operation_interstate_carrier: boolean | null
          operation_intrastate_hazmat_carrier: boolean | null
          operation_intrastate_hazmat_shipper: boolean | null
          operation_intrastate_non_hazmat_carrier: boolean | null
          operation_intrastate_non_hazmat_shipper: boolean | null
          operator_ein: string | null
          operator_email: string | null
          operator_first_name: string | null
          operator_last_name: string | null
          operator_miles_driven: number | null
          operator_phone: string | null
          operator_ssn: string | null
          operator_title: string | null
          payment_amount: number | null
          payment_method: string | null
          payment_status: string | null
          principal_address_city: string | null
          principal_address_country: string | null
          principal_address_state: string | null
          principal_address_street: string | null
          principal_address_zip: string | null
          reason_for_filing: string
          signature_url: string | null
          transaction_id: string | null
          usdot_number: string
        }
        Insert: {
          address_modified?: boolean | null
          cargo_agricultural?: boolean | null
          cargo_beverages?: boolean | null
          cargo_building_materials?: boolean | null
          cargo_chemicals?: boolean | null
          cargo_coal?: boolean | null
          cargo_commodities_dry_bulk?: boolean | null
          cargo_construction?: boolean | null
          cargo_drive_away?: boolean | null
          cargo_fresh_produce?: boolean | null
          cargo_garbage?: boolean | null
          cargo_general_freight?: boolean | null
          cargo_grain?: boolean | null
          cargo_household_goods?: boolean | null
          cargo_intermodal_containers?: boolean | null
          cargo_liquids_gases?: boolean | null
          cargo_livestock?: boolean | null
          cargo_logs?: boolean | null
          cargo_machinery?: boolean | null
          cargo_meat?: boolean | null
          cargo_metal_sheets?: boolean | null
          cargo_mobile_homes?: boolean | null
          cargo_motor_vehicles?: boolean | null
          cargo_oilfield_equipment?: boolean | null
          cargo_other?: boolean | null
          cargo_paper_products?: boolean | null
          cargo_passengers?: boolean | null
          cargo_refrigerated_food?: boolean | null
          cargo_us_mail?: boolean | null
          cargo_utilities?: boolean | null
          cargo_water_well?: boolean | null
          changes_to_make?: Json | null
          classification_authorized_for_hire?: boolean | null
          classification_exempt_for_hire?: boolean | null
          classification_federal_government?: boolean | null
          classification_indian_tribe?: boolean | null
          classification_local_government?: boolean | null
          classification_migrant?: boolean | null
          classification_private_passengers_business?: boolean | null
          classification_private_passengers_non_business?: boolean | null
          classification_private_property?: boolean | null
          classification_state_government?: boolean | null
          classification_us_mail?: boolean | null
          company_ein?: string | null
          company_email?: string | null
          company_info_changes?: Json | null
          company_owner_name?: string | null
          company_phone?: string | null
          company_ssn?: string | null
          created_at?: string | null
          filing_id: string
          filing_type: string
          form_mailing_address_city?: string | null
          form_mailing_address_country?: string | null
          form_mailing_address_state?: string | null
          form_mailing_address_street?: string | null
          form_mailing_address_zip?: string | null
          form_physical_address_city?: string | null
          form_physical_address_country?: string | null
          form_physical_address_state?: string | null
          form_physical_address_street?: string | null
          form_physical_address_zip?: string | null
          has_changes?: boolean | null
          id?: string
          license_url?: string | null
          mailing_address_city?: string | null
          mailing_address_country?: string | null
          mailing_address_state?: string | null
          mailing_address_street?: string | null
          mailing_address_zip?: string | null
          operating_info_changes?: Json | null
          operation_interstate_carrier?: boolean | null
          operation_intrastate_hazmat_carrier?: boolean | null
          operation_intrastate_hazmat_shipper?: boolean | null
          operation_intrastate_non_hazmat_carrier?: boolean | null
          operation_intrastate_non_hazmat_shipper?: boolean | null
          operator_ein?: string | null
          operator_email?: string | null
          operator_first_name?: string | null
          operator_last_name?: string | null
          operator_miles_driven?: number | null
          operator_phone?: string | null
          operator_ssn?: string | null
          operator_title?: string | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          principal_address_city?: string | null
          principal_address_country?: string | null
          principal_address_state?: string | null
          principal_address_street?: string | null
          principal_address_zip?: string | null
          reason_for_filing: string
          signature_url?: string | null
          transaction_id?: string | null
          usdot_number: string
        }
        Update: {
          address_modified?: boolean | null
          cargo_agricultural?: boolean | null
          cargo_beverages?: boolean | null
          cargo_building_materials?: boolean | null
          cargo_chemicals?: boolean | null
          cargo_coal?: boolean | null
          cargo_commodities_dry_bulk?: boolean | null
          cargo_construction?: boolean | null
          cargo_drive_away?: boolean | null
          cargo_fresh_produce?: boolean | null
          cargo_garbage?: boolean | null
          cargo_general_freight?: boolean | null
          cargo_grain?: boolean | null
          cargo_household_goods?: boolean | null
          cargo_intermodal_containers?: boolean | null
          cargo_liquids_gases?: boolean | null
          cargo_livestock?: boolean | null
          cargo_logs?: boolean | null
          cargo_machinery?: boolean | null
          cargo_meat?: boolean | null
          cargo_metal_sheets?: boolean | null
          cargo_mobile_homes?: boolean | null
          cargo_motor_vehicles?: boolean | null
          cargo_oilfield_equipment?: boolean | null
          cargo_other?: boolean | null
          cargo_paper_products?: boolean | null
          cargo_passengers?: boolean | null
          cargo_refrigerated_food?: boolean | null
          cargo_us_mail?: boolean | null
          cargo_utilities?: boolean | null
          cargo_water_well?: boolean | null
          changes_to_make?: Json | null
          classification_authorized_for_hire?: boolean | null
          classification_exempt_for_hire?: boolean | null
          classification_federal_government?: boolean | null
          classification_indian_tribe?: boolean | null
          classification_local_government?: boolean | null
          classification_migrant?: boolean | null
          classification_private_passengers_business?: boolean | null
          classification_private_passengers_non_business?: boolean | null
          classification_private_property?: boolean | null
          classification_state_government?: boolean | null
          classification_us_mail?: boolean | null
          company_ein?: string | null
          company_email?: string | null
          company_info_changes?: Json | null
          company_owner_name?: string | null
          company_phone?: string | null
          company_ssn?: string | null
          created_at?: string | null
          filing_id?: string
          filing_type?: string
          form_mailing_address_city?: string | null
          form_mailing_address_country?: string | null
          form_mailing_address_state?: string | null
          form_mailing_address_street?: string | null
          form_mailing_address_zip?: string | null
          form_physical_address_city?: string | null
          form_physical_address_country?: string | null
          form_physical_address_state?: string | null
          form_physical_address_street?: string | null
          form_physical_address_zip?: string | null
          has_changes?: boolean | null
          id?: string
          license_url?: string | null
          mailing_address_city?: string | null
          mailing_address_country?: string | null
          mailing_address_state?: string | null
          mailing_address_street?: string | null
          mailing_address_zip?: string | null
          operating_info_changes?: Json | null
          operation_interstate_carrier?: boolean | null
          operation_intrastate_hazmat_carrier?: boolean | null
          operation_intrastate_hazmat_shipper?: boolean | null
          operation_intrastate_non_hazmat_carrier?: boolean | null
          operation_intrastate_non_hazmat_shipper?: boolean | null
          operator_ein?: string | null
          operator_email?: string | null
          operator_first_name?: string | null
          operator_last_name?: string | null
          operator_miles_driven?: number | null
          operator_phone?: string | null
          operator_ssn?: string | null
          operator_title?: string | null
          payment_amount?: number | null
          payment_method?: string | null
          payment_status?: string | null
          principal_address_city?: string | null
          principal_address_country?: string | null
          principal_address_state?: string | null
          principal_address_street?: string | null
          principal_address_zip?: string | null
          reason_for_filing?: string
          signature_url?: string | null
          transaction_id?: string | null
          usdot_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcs150_airtable_records_filing_id_fkey"
            columns: ["filing_id"]
            isOneToOne: true
            referencedRelation: "filings"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          filing_id: string
          filing_type: Database["public"]["Enums"]["filing_type"]
          id: string
          payment_method: string | null
          status: string
          updated_at: string | null
          usdot_number: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          filing_id: string
          filing_type: Database["public"]["Enums"]["filing_type"]
          id?: string
          payment_method?: string | null
          status: string
          updated_at?: string | null
          usdot_number: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          filing_id?: string
          filing_type?: Database["public"]["Enums"]["filing_type"]
          id?: string
          payment_method?: string | null
          status?: string
          updated_at?: string | null
          usdot_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_filing_id_fkey"
            columns: ["filing_id"]
            isOneToOne: true
            referencedRelation: "filings"
            referencedColumns: ["id"]
          },
        ]
      }
      ucr_airtable_records: {
        Row: {
          api_mailing_address_city: string | null
          api_mailing_address_country: string | null
          api_mailing_address_state: string | null
          api_mailing_address_street: string | null
          api_mailing_address_zip: string | null
          api_physical_address_city: string | null
          api_physical_address_country: string | null
          api_physical_address_state: string | null
          api_physical_address_street: string | null
          api_physical_address_zip: string | null
          classification_broker: boolean | null
          classification_freight_forwarder: boolean | null
          classification_leasing_company: boolean | null
          classification_motor_carrier: boolean | null
          classification_motor_private: boolean | null
          company_name: string | null
          created_at: string | null
          email: string | null
          filing_type: string
          full_name: string | null
          id: string
          needs_vehicle_changes: string | null
          phone: string | null
          registration_year: string | null
          usdot_number: string
          vehicles_add_vehicles: number | null
          vehicles_exclude_vehicles: number | null
          vehicles_passenger_vehicles: number | null
          vehicles_power_units: number | null
          vehicles_straight_trucks: number | null
          vehicles_total: number | null
        }
        Insert: {
          api_mailing_address_city?: string | null
          api_mailing_address_country?: string | null
          api_mailing_address_state?: string | null
          api_mailing_address_street?: string | null
          api_mailing_address_zip?: string | null
          api_physical_address_city?: string | null
          api_physical_address_country?: string | null
          api_physical_address_state?: string | null
          api_physical_address_street?: string | null
          api_physical_address_zip?: string | null
          classification_broker?: boolean | null
          classification_freight_forwarder?: boolean | null
          classification_leasing_company?: boolean | null
          classification_motor_carrier?: boolean | null
          classification_motor_private?: boolean | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          filing_type: string
          full_name?: string | null
          id?: string
          needs_vehicle_changes?: string | null
          phone?: string | null
          registration_year?: string | null
          usdot_number: string
          vehicles_add_vehicles?: number | null
          vehicles_exclude_vehicles?: number | null
          vehicles_passenger_vehicles?: number | null
          vehicles_power_units?: number | null
          vehicles_straight_trucks?: number | null
          vehicles_total?: number | null
        }
        Update: {
          api_mailing_address_city?: string | null
          api_mailing_address_country?: string | null
          api_mailing_address_state?: string | null
          api_mailing_address_street?: string | null
          api_mailing_address_zip?: string | null
          api_physical_address_city?: string | null
          api_physical_address_country?: string | null
          api_physical_address_state?: string | null
          api_physical_address_street?: string | null
          api_physical_address_zip?: string | null
          classification_broker?: boolean | null
          classification_freight_forwarder?: boolean | null
          classification_leasing_company?: boolean | null
          classification_motor_carrier?: boolean | null
          classification_motor_private?: boolean | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          filing_type?: string
          full_name?: string | null
          id?: string
          needs_vehicle_changes?: string | null
          phone?: string | null
          registration_year?: string | null
          usdot_number?: string
          vehicles_add_vehicles?: number | null
          vehicles_exclude_vehicles?: number | null
          vehicles_passenger_vehicles?: number | null
          vehicles_power_units?: number | null
          vehicles_straight_trucks?: number | null
          vehicles_total?: number | null
        }
        Relationships: []
      }
      usdot_info: {
        Row: {
          api_dba_flag: boolean | null
          api_dba_name: string | null
          api_mailing_address_city: string | null
          api_mailing_address_country: string | null
          api_mailing_address_state: string | null
          api_mailing_address_street: string | null
          api_mailing_address_zip: string | null
          api_physical_address_city: string | null
          api_physical_address_country: string | null
          api_physical_address_state: string | null
          api_physical_address_street: string | null
          api_physical_address_zip: string | null
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
          api_dba_flag?: boolean | null
          api_dba_name?: string | null
          api_mailing_address_city?: string | null
          api_mailing_address_country?: string | null
          api_mailing_address_state?: string | null
          api_mailing_address_street?: string | null
          api_mailing_address_zip?: string | null
          api_physical_address_city?: string | null
          api_physical_address_country?: string | null
          api_physical_address_state?: string | null
          api_physical_address_street?: string | null
          api_physical_address_zip?: string | null
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
          api_dba_flag?: boolean | null
          api_dba_name?: string | null
          api_mailing_address_city?: string | null
          api_mailing_address_country?: string | null
          api_mailing_address_state?: string | null
          api_mailing_address_street?: string | null
          api_mailing_address_zip?: string | null
          api_physical_address_city?: string | null
          api_physical_address_country?: string | null
          api_physical_address_state?: string | null
          api_physical_address_street?: string | null
          api_physical_address_zip?: string | null
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
      parse_numeric_with_commas: {
        Args: {
          input_str: string
        }
        Returns: number
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
