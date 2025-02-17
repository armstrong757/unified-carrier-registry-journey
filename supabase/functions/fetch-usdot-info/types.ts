
export interface USDOTResponse {
  usdot_number: string;
  legal_name: string;
  dba_name?: string;
  operating_status?: string;
  usdot_status?: string;
  entity_type?: string;
  entity_type_desc: string;
  physical_address?: string;
  telephone_number?: string;
  total_power_units?: string;
  total_drivers?: string;
  mcs150_year?: string;
  mcs150_mileage?: string;
  basics_data?: Record<string, any>;
  [key: string]: any; // Allow for additional fields from the API
}
