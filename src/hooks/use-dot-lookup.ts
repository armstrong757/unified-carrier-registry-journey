
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { USDOTData } from "@/types/filing";
import { useToast } from "@/components/ui/use-toast";
import { validateDOTData } from "@/utils/dot-data-validation";
import { mapAPIResponse } from "@/utils/dot-api-mapper";
import type { Database } from "@/integrations/supabase/types";

type USDOTInfo = Database['public']['Tables']['usdot_info']['Insert'];

const DEBOUNCE_TIMEOUT = 300;
let debounceTimer: NodeJS.Timeout;

function transformToUSDOTData(mappedData: any): USDOTData {
  const physical = mappedData.physical_address_parsed;
  const mailing = mappedData.mailing_address_parsed;

  return {
    usdotNumber: mappedData.usdot_number,
    legalName: mappedData.legal_name,
    dbaName: mappedData.dba_name,
    operatingStatus: mappedData.operating_status,
    entityType: mappedData.entity_type,
    physicalAddress: mappedData.physical_address,
    physicalAddressStreet: physical.street,
    physicalAddressCity: physical.city,
    physicalAddressState: physical.state,
    physicalAddressZip: physical.zip,
    physicalAddressCountry: physical.country,
    mailingAddressStreet: mailing.street,
    mailingAddressCity: mailing.city,
    mailingAddressState: mailing.state,
    mailingAddressZip: mailing.zip,
    mailingAddressCountry: mailing.country,
    telephone: mappedData.telephone || '',
    powerUnits: mappedData.power_units,
    drivers: mappedData.drivers,
    insuranceBIPD: 0,
    insuranceBond: 0,
    insuranceCargo: 0,
    riskScore: 'Unknown',
    outOfServiceDate: mappedData.out_of_service_date,
    mcs150FormDate: mappedData.mcs150_last_update,
    mcs150Date: mappedData.mcs150_last_update,
    mcs150Year: mappedData.mcs150_year ? parseInt(mappedData.mcs150_year) : undefined,
    mcs150Mileage: mappedData.mcs150_mileage || 0,
    carrierOperation: '',
    cargoCarried: [],
    busCount: 0,
    limoCount: 0,
    minibusCount: 0,
    motorcoachCount: 0,
    vanCount: 0,
    complaintCount: 0,
    outOfService: mappedData.out_of_service,
    mcNumber: ''
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

    return new Promise((resolve) => {
      debounceTimer = setTimeout(async () => {
        setIsLoading(true);
        
        try {
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

          // Always make a fresh API call
          console.log('Making API request for DOT:', trimmedDOT);
          const { data, error } = await supabase.functions.invoke('fetch-usdot-info', {
            body: { dotNumber: trimmedDOT },
          });

          if (error) {
            console.error('Edge function error:', error);
            throw error;
          }

          if (!data || !data.items || !data.items[0]) {
            throw new Error('No data received from DOT lookup');
          }

          // Map and validate the API response
          const mappedData = mapAPIResponse(data.items[0]);
          const validatedData = validateDOTData(mappedData);

          if (!validatedData) {
            throw new Error('Invalid data received from API');
          }

          // Transform to USDOTData format
          const transformedData = transformToUSDOTData(mappedData);

          // Ensure numeric values are properly typed
          const powerUnits = mappedData.power_units ? Number(mappedData.power_units) : null;
          const drivers = mappedData.drivers ? Number(mappedData.drivers) : null;

          // Store or update the data in usdot_info table
          const usdotInfo: USDOTInfo = {
            usdot_number: trimmedDOT,
            legal_name: mappedData.legal_name,
            dba_name: mappedData.dba_name,
            api_dba_name: mappedData.api_dba_name,
            api_dba_flag: mappedData.api_dba_flag,
            operating_status: mappedData.operating_status,
            entity_type: mappedData.entity_type,
            physical_address: mappedData.physical_address,
            telephone: mappedData.telephone,
            power_units: powerUnits,
            drivers: drivers,
            mcs150_last_update: mappedData.mcs150_last_update,
            out_of_service: mappedData.out_of_service,
            out_of_service_date: mappedData.out_of_service_date,
            mileage_year: mappedData.mcs150_year,
            api_physical_address_street: mappedData.physical_address_parsed.street,
            api_physical_address_city: mappedData.physical_address_parsed.city,
            api_physical_address_state: mappedData.physical_address_parsed.state,
            api_physical_address_zip: mappedData.physical_address_parsed.zip,
            api_physical_address_country: mappedData.physical_address_parsed.country,
            api_mailing_address_street: mappedData.mailing_address_parsed.street,
            api_mailing_address_city: mappedData.mailing_address_parsed.city,
            api_mailing_address_state: mappedData.mailing_address_parsed.state,
            api_mailing_address_zip: mappedData.mailing_address_parsed.zip,
            api_mailing_address_country: mappedData.mailing_address_parsed.country,
            updated_at: new Date().toISOString()
          };

          const { error: upsertError } = await supabase
            .from('usdot_info')
            .upsert(usdotInfo);

          if (upsertError) {
            console.error('Error storing USDOT info:', upsertError);
            throw upsertError;
          }

          if (existingFiling) {
            console.log('Found existing filing:', existingFiling);
            resolve({ usdotData: transformedData, resumedFiling: existingFiling });
          } else {
            resolve({ usdotData: transformedData });
          }
        } catch (error) {
          console.error('Error in DOT lookup:', error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to fetch DOT information",
            variant: "destructive"
          });
          resolve(null);
        } finally {
          setIsLoading(false);
        }
      }, DEBOUNCE_TIMEOUT);
    });
  }, [filingType, toast]);

  return { lookupDOT, isLoading };
};
