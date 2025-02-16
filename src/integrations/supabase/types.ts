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
      filings: {
        Row: {
          completed_at: string | null
          created_at: string | null
          email: string | null
          filing_type: Database["public"]["Enums"]["filing_type"]
          form_data: Json
          id: string
          status: string
          updated_at: string | null
          usdot_number: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          email?: string | null
          filing_type: Database["public"]["Enums"]["filing_type"]
          form_data?: Json
          id?: string
          status?: string
          updated_at?: string | null
          usdot_number: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          email?: string | null
          filing_type?: Database["public"]["Enums"]["filing_type"]
          form_data?: Json
          id?: string
          status?: string
          updated_at?: string | null
          usdot_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "filings_usdot_number_fkey"
            columns: ["usdot_number"]
            isOneToOne: false
            referencedRelation: "usdot_info"
            referencedColumns: ["usdot_number"]
          },
        ]
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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
