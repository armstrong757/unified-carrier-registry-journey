
export interface USDOTResponse {
  dot_number: string;
  legal_name: string;
  dba_name?: string;
  usdot_status?: string;
  entity_type_desc?: string;
  physical_address?: string;
  telephone_number?: string;
  total_power_units?: string;
  total_drivers?: string;
  mcs150_year?: string;
  mcs150_mileage?: string;
  insurance_bipd_on_file?: string;
  insurance_bond_on_file?: string;
  insurance_cargo_on_file?: string;
  risk_score?: string;
  out_of_service_date?: string;
  out_of_service_flag?: boolean;
  complaint_count?: string;
  basics_data?: any;
}
