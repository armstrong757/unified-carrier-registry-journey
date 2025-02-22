
import { z } from "zod";

// Define validation schemas
const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().default('USA')
});

const dotDataSchema = z.object({
  usdot_number: z.string(),
  legal_name: z.string(),
  dba_name: z.string().optional(),
  api_dba_name: z.string().optional(),
  api_dba_flag: z.boolean(),
  operating_status: z.string(),
  entity_type: z.string().optional(),
  physical_address: z.string().optional(),
  telephone: z.string().nullable().optional(),
  power_units: z.number().nonnegative(),
  drivers: z.number().nonnegative(),
  mcs150_last_update: z.string().nullable(),
  out_of_service: z.boolean(),
  out_of_service_date: z.string().nullable(),
  physical_address_parsed: addressSchema,
  mailing_address_parsed: addressSchema,
});

export function validateDOTData(data: unknown) {
  try {
    return dotDataSchema.parse(data);
  } catch (error) {
    console.error('Data validation error:', error);
    return null;
  }
}

export function cleanPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 ? cleaned : '';
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
