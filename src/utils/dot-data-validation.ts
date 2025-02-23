
import { z } from "zod";

// Define validation schemas
const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().default('USA')
});

// Updated schema to match actual API response
const dotDataSchema = z.object({
  dot_number: z.string(),
  docket_prefix: z.string().optional(),
  docket_number: z.string().optional(),
  docket: z.string().optional(),
  legal_name: z.string(),
  dba_flag: z.boolean().optional(),
  dba_name: z.string().optional(),
  usdot_status: z.string(),
  entity_type_desc: z.string().optional(),
  total_power_units: z.string().optional(),
  total_drivers: z.string().optional(),
  physical_address: z.string().optional(),
  physical_address_street: z.string().optional(),
  physical_address_city: z.string().optional(),
  physical_address_state: z.string().optional(),
  physical_address_zip_code: z.string().optional(),
  telephone_number: z.string().optional(),
  mcs150_year: z.string().optional(),
  mcs150_date: z.string().optional(),
  mcs150_mileage: z.string().optional(),
  insurance_bipd_on_file: z.string().optional(),
  insurance_bond_on_file: z.string().optional(),
  insurance_cargo_on_file: z.string().optional(),
  out_of_service_flag: z.boolean().optional(),
  risk_score: z.string().optional()
});

export function validateDOTData(data: unknown) {
  try {
    console.log('Validating data:', data);
    return dotDataSchema.parse(data);
  } catch (error) {
    console.error('Data validation error:', error);
    return null;
  }
}

export function cleanPhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 ? cleaned : null;
}

export function parseNumericValue(value: string | number | null | undefined): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const parsed = Number(value.toString().replace(/[^0-9.-]+/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

export function formatDate(date: string | null | undefined): string | null {
  if (!date) return null;
  try {
    return new Date(date).toISOString();
  } catch (e) {
    return null;
  }
}
