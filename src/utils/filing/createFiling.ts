
import { supabase } from "@/integrations/supabase/client";
import { FilingType, USDOTData } from "@/types/filing";
import { sanitizeAndProcessFormData } from "./formProcessing";

export const createFiling = async (usdotNumber: string, filingType: FilingType, initialFormData: any = {}) => {
  try {
    const usdotData = initialFormData.usdotData as USDOTData;
    
    // Prepare USDOT info record
    const usdotRecord = {
      usdot_number: usdotNumber,
      legal_name: usdotData?.legalName || 'Unknown',
      dba_name: usdotData?.dbaName,
      operating_status: usdotData?.operatingStatus,
      entity_type: usdotData?.entityType,
      physical_address: usdotData?.physicalAddress,
      telephone: usdotData?.telephone,
      power_units: usdotData?.powerUnits || 0,
      drivers: usdotData?.drivers || 0,
      mcs150_last_update: usdotData?.mcs150FormDate,
      bus_count: 0,
      limo_count: 0,
      minibus_count: 0,
      motorcoach_count: 0,
      van_count: 0,
      updated_at: new Date().toISOString()
    };

    // Use upsert to either create or update the USDOT info record
    const { error: usdotError } = await supabase
      .from('usdot_info')
      .upsert(usdotRecord, {
        onConflict: 'usdot_number'
      });

    if (usdotError) throw usdotError;

    // Generate a resume token for the filing
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('generate_resume_token');
    
    if (tokenError) throw tokenError;

    // Process and sanitize form data
    const { formData, flatFormData, attachments } = await sanitizeAndProcessFormData(initialFormData, usdotNumber);

    const { data, error } = await supabase
      .from('filings')
      .insert([
        {
          usdot_number: usdotNumber,
          filing_type: filingType,
          form_data: formData,
          flat_form_data: flatFormData,
          attachments,
          status: 'draft',
          email: formData.email || formData.operator?.email,
          resume_token: tokenData,
          last_step_completed: 1
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating filing:', error);
    throw error;
  }
};
