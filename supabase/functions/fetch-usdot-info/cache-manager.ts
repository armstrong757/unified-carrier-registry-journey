
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { USDOTResponse } from './types.ts'

export const getCachedResponse = async (supabase: any, dotNumber: string): Promise<USDOTResponse | null> => {
  try {
    const { data, error } = await supabase
      .from('usdot_info')
      .select('*')
      .eq('usdot_number', dotNumber.toString())
      .maybeSingle();

    if (error) throw error;
    
    if (!data) return null;

    // Transform database record back to API response format
    return {
      usdot_number: data.usdot_number,
      legal_name: data.legal_name,
      dba_name: data.dba_name,
      operating_status: data.operating_status,
      entity_type: data.entity_type,
      physical_address: data.physical_address,
      telephone_number: data.telephone,
      total_power_units: data.power_units?.toString(),
      total_drivers: data.drivers?.toString(),
      mcs150_year: data.mileage_year,
      mcs150_mileage: "0", // Default as we don't store this
      entity_type_desc: data.entity_type,
      basics_data: data.basics_data || {}
    };
  } catch (error) {
    console.error('Error fetching cached response:', error);
    return null;
  }
};

export const cacheResponse = async (supabase: any, dotNumber: string, response: USDOTResponse) => {
  try {
    console.log('Caching response for DOT:', dotNumber, response);

    const usdotRecord = {
      usdot_number: dotNumber.toString(),
      legal_name: response.legal_name,
      dba_name: response.dba_name,
      operating_status: response.operating_status || response.usdot_status,
      entity_type: response.entity_type_desc,
      physical_address: response.physical_address,
      telephone: response.telephone_number?.toString(),
      power_units: parseInt(response.total_power_units || '0'),
      drivers: parseInt(response.total_drivers || '0'),
      mcs150_last_update: null, // Set if available in response
      basics_data: response.basics_data || {},
      out_of_service: false, // Set if available in response
      out_of_service_date: null, // Set if available in response
      updated_at: new Date().toISOString()
    };

    console.log('Upserting USDOT record:', usdotRecord);

    const { error } = await supabase
      .from('usdot_info')
      .upsert(usdotRecord, {
        onConflict: 'usdot_number',
        returning: 'minimal'
      });

    if (error) {
      console.error('Error caching response:', error);
      throw error;
    }

    console.log('Successfully cached DOT information');
  } catch (error) {
    console.error('Error in cacheResponse:', error);
    throw error;
  }
};
