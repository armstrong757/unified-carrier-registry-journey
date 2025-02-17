
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
    mcs150_year: '',
    mcs150_mileage: '0',
    basics_data: existingData.basics_data || {}
  };
}

export async function cacheResponse(supabase: any, dotNumber: string, data: USDOTResponse): Promise<void> {
  const usdotRecord = {
    usdot_number: dotNumber,
    legal_name: data.legal_name,
    dba_name: data.dba_name,
    operating_status: data.operating_status,
    entity_type: data.entity_type,
    physical_address: data.physical_address,
    telephone: data.telephone_number,
    power_units: parseInt(data.total_power_units) || 0,
    drivers: parseInt(data.total_drivers) || 0,
    mcs150_last_update: new Date().toISOString(),
    bus_count: 0,
    limo_count: 0,
    minibus_count: 0,
    motorcoach_count: 0,
    van_count: 0,
    basics_data: data.basics_data || {},
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
