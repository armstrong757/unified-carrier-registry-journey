
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { USDOTResponse } from './types.ts';

export async function getCachedResponse(supabase: any, dotNumber: string): Promise<USDOTResponse | null> {
  const { data: existingData, error } = await supabase
    .from('usdot_info')
    .select('*')
    .eq('usdot_number', dotNumber)
    .maybeSingle();

  if (error) {
    console.error('Cache fetch error:', error);
    return null;
  }

  if (!existingData) return null;

  // Convert database record to API response format
  return {
    usdot_number: existingData.usdot_number,
    legal_name: existingData.legal_name,
    dba_name: existingData.dba_name,
    operating_status: existingData.operating_status,
    entity_type: existingData.entity_type,
    entity_type_desc: existingData.entity_type,
    physical_address: existingData.physical_address,
    telephone_number: existingData.telephone,
    total_power_units: existingData.power_units?.toString() || '0',
    total_drivers: existingData.drivers?.toString() || '0',
    mcs150_year: existingData.mileage_year || '',
    mcs150_mileage: existingData.mcs150_mileage?.toString() || '0',
    basics_data: existingData.basics_data || {}
  };
}

export async function cacheResponse(supabase: any, dotNumber: string, apiData: any): Promise<void> {
  // Extract the carrier data from the API response
  const carrier = apiData.items?.[0];
  if (!carrier) {
    throw new Error('No carrier data found in API response');
  }

  console.log('Processing carrier data for caching:', carrier);

  // Map API response to database schema
  const usdotRecord = {
    usdot_number: carrier.dot_number,
    legal_name: carrier.legal_name,
    dba_name: carrier.dba_name || null,
    operating_status: carrier.usdot_status,
    entity_type: carrier.entity_type_desc,
    physical_address: carrier.physical_address,
    telephone: carrier.telephone_number?.toString(),
    ein: carrier.ein,
    mc_number: carrier.docket,
    power_units: parseInt(carrier.total_power_units) || 0,
    drivers: parseInt(carrier.total_drivers) || 0,
    mcs150_last_update: carrier.mcs150_year ? new Date(`${carrier.mcs150_year}-01-01`) : null,
    mileage_year: carrier.mcs150_year?.toString(),
    out_of_service: carrier.out_of_service_flag || false,
    out_of_service_date: carrier.out_of_service_date,
    complaint_count: parseInt(carrier.complaint_count) || 0,
    bus_count: parseInt(carrier.bus_count) || 0,
    limo_count: parseInt(carrier.limo_count) || 0,
    minibus_count: parseInt(carrier.minibus_count) || 0,
    motorcoach_count: parseInt(carrier.motorcoach_count) || 0,
    van_count: parseInt(carrier.van_count) || 0,
    basics_data: carrier.basics_data || {},
    updated_at: new Date().toISOString()
  };

  console.log('Caching USDOT info:', usdotRecord);

  const { error } = await supabase
    .from('usdot_info')
    .upsert(usdotRecord, {
      onConflict: 'usdot_number'
    });

  if (error) {
    console.error('Error caching USDOT info:', error);
    throw error;
  }
}
