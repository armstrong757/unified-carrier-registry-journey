
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { USDOTData } from "@/types/filing";
import { useToast } from "@/components/ui/use-toast";
import { validateDOTData } from "@/utils/dot-data-validation";
import { mapAPIResponse } from "@/utils/dot-api-mapper";

const DEBOUNCE_TIMEOUT = 300;
let debounceTimer: NodeJS.Timeout;

function transformToUSDOTData(data: any): USDOTData {
  return {
    usdotNumber: (data.usdot_number || data.dot_number || '').toString(),
    legalName: data.legal_name || '',
    dbaName: data.dba_name || '',
    operatingStatus: data.operating_status || data.usdot_status || '',
    entityType: data.entity_type || data.entity_type_desc || '',
    physicalAddress: data.physical_address || '',
    physicalAddressStreet: data.physical_address_street || '',
    physicalAddressCity: data.physical_address_city || '',
    physicalAddressState: data.physical_address_state || '',
    physicalAddressZip: data.physical_address_zip_code || '',
    physicalAddressCountry: 'USA',
    mailingAddressStreet: data.mailing_address_street || '',
    mailingAddressCity: data.mailing_address_city || '',
    mailingAddressState: data.mailing_address_state || '',
    mailingAddressZip: data.mailing_address_zip_code || '',
    mailingAddressCountry: 'USA',
    telephone: data.telephone || data.telephone_number || '',
    powerUnits: parseInt(data.power_units || data.total_power_units || '0'),
    drivers: parseInt(data.drivers || data.total_drivers || '0'),
    busCount: parseInt(data.bus_count || '0'),
    limoCount: parseInt(data.limo_count || '0'),
    minibusCount: parseInt(data.minibus_count || '0'),
    motorcoachCount: parseInt(data.motorcoach_count || '0'),
    vanCount: parseInt(data.van_count || '0'),
    complaintCount: parseInt(data.complaint_count || '0'),
    outOfService: Boolean(data.out_of_service || data.out_of_service_flag),
    outOfServiceDate: data.out_of_service_date || null,
    mcNumber: data.mc_number || '',
    mcs150Date: data.mcs150_date || data.mcs150_last_update || null,
    mcs150Year: parseInt(data.mcs150_year || '0'),
    mcs150Mileage: parseInt(data.mcs150_mileage || '0'),
    carrierOperation: data.carrier_operation || '',
    cargoCarried: Array.isArray(data.cargo_carried) ? data.cargo_carried : [],
    insuranceBIPD: parseInt(data.insurance_bipd_on_file || '0'),
    insuranceBond: parseInt(data.insurance_bond_on_file || '0'),
    insuranceCargo: parseInt(data.insurance_cargo_on_file || '0'),
    riskScore: data.risk_score || ''
  };
}

export const useDOTLookup = (filingType: 'ucr' | 'mcs150') => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const lookupDOT = useCallback(async (dotNumber: string): Promise<{
    usdotData: USDOTData;
    resumedFiling?: any;
  } | null> => {
    const trimmedDOT = dotNumber.trim();
    
    if (!trimmedDOT) {
      toast({
        title: "Error",
        description: "Please enter a DOT number",
        variant: "destructive"
      });
      return null;
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    return new Promise((resolve, reject) => {
      debounceTimer = setTimeout(async () => {
        setIsLoading(true);
        
        try {
          // Make API call first - don't use cache
          console.log('Making API request for DOT:', trimmedDOT);
          const { data: apiData, error: apiError } = await supabase.functions.invoke('fetch-usdot-info', {
            body: { dotNumber: trimmedDOT }
          });

          if (apiError) {
            console.error('API Error:', apiError);
            throw apiError;
          }

          if (!apiData?.items?.[0]) {
            throw new Error('No data received from DOT lookup');
          }

          const dotData = apiData.items[0];
          console.log('Received DOT data:', dotData);

          // Store the raw data in the database
          const { error: upsertError } = await supabase
            .from('usdot_info')
            .upsert({
              usdot_number: trimmedDOT,
              basics_data: dotData,
              updated_at: new Date().toISOString()
            });

          if (upsertError) {
            console.error('Error storing USDOT info:', upsertError);
          }

          // Check for existing draft filing
          const { data: existingFiling, error: filingError } = await supabase
            .from('filings')
            .select('*')
            .eq('usdot_number', trimmedDOT)
            .eq('filing_type', filingType)
            .eq('status', 'draft')
            .gt('resume_token_expires_at', new Date().toISOString())
            .maybeSingle();

          if (filingError) throw filingError;

          // Map and validate the data
          const mappedData = mapAPIResponse(dotData);
          console.log('Mapped data:', mappedData);
          
          const validatedData = validateDOTData(mappedData);
          if (!validatedData) {
            throw new Error('Invalid data received from API');
          }

          // Transform to USDOTData format
          const transformedData = transformToUSDOTData(validatedData);
          console.log('Transformed data:', transformedData);

          if (existingFiling) {
            console.log('Found existing filing:', existingFiling);
            resolve({ usdotData: transformedData, resumedFiling: existingFiling });
          } else {
            resolve({ usdotData: transformedData });
          }

        } catch (error: any) {
          console.error('Error in DOT lookup:', error);
          toast({
            title: "Error",
            description: "Failed to fetch DOT information. Please try again.",
            variant: "destructive"
          });
          reject(error);
        } finally {
          setIsLoading(false);
        }
      }, DEBOUNCE_TIMEOUT);
    });
  }, [filingType, toast]);

  return { lookupDOT, isLoading };
};
