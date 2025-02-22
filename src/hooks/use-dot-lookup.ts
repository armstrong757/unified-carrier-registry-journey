
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { USDOTData } from "@/types/filing";
import { useToast } from "@/components/ui/use-toast";
import { validateDOTData } from "@/utils/dot-data-validation";
import { mapAPIResponse } from "@/utils/dot-api-mapper";

const DEBOUNCE_TIMEOUT = 300;
let debounceTimer: NodeJS.Timeout;

function transformToUSDOTData(mappedData: any): USDOTData {
  const physical = mappedData.physical_address_parsed || {};
  const mailing = mappedData.mailing_address_parsed || {};

  return {
    usdotNumber: mappedData.usdot_number || mappedData.dot_number || '',
    legalName: mappedData.legal_name || '',
    dbaName: mappedData.dba_name || '',
    operatingStatus: mappedData.operating_status || mappedData.usdot_status || '',
    entityType: mappedData.entity_type || mappedData.entity_type_desc || '',
    physicalAddress: mappedData.physical_address || '',
    physicalAddressStreet: physical.street || '',
    physicalAddressCity: physical.city || '',
    physicalAddressState: physical.state || '',
    physicalAddressZip: physical.zip || '',
    physicalAddressCountry: physical.country || 'USA',
    mailingAddressStreet: mailing.street || '',
    mailingAddressCity: mailing.city || '',
    mailingAddressState: mailing.state || '',
    mailingAddressZip: mailing.zip || '',
    mailingAddressCountry: 'USA',
    telephone: mappedData.telephone || mappedData.telephone_number || '',
    powerUnits: parseInt(mappedData.power_units || mappedData.total_power_units || '0'),
    drivers: parseInt(mappedData.drivers || mappedData.total_drivers || '0'),
    insuranceBIPD: 0,
    insuranceBond: 0,
    insuranceCargo: 0,
    riskScore: 'Unknown',
    outOfServiceDate: mappedData.out_of_service_date || null,
    mcs150FormDate: mappedData.mcs150_last_update || null,
    mcs150Date: mappedData.mcs150_last_update || null,
    mcs150Year: parseInt(mappedData.mcs150_year || '0'),
    mcs150Mileage: parseInt(mappedData.mcs150_mileage || '0'),
    carrierOperation: '',
    cargoCarried: [],
    busCount: 0,
    limoCount: 0,
    minibusCount: 0,
    motorcoachCount: 0,
    vanCount: 0,
    complaintCount: 0,
    outOfService: mappedData.out_of_service || false,
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
          // Check for existing draft filing first
          const { data: existingFiling, error: filingError } = await supabase
            .from('filings')
            .select('*')
            .eq('usdot_number', trimmedDOT)
            .eq('filing_type', filingType)
            .eq('status', 'draft')
            .gt('resume_token_expires_at', new Date().toISOString())
            .maybeSingle();

          if (filingError) throw filingError;

          // Try getting cached data first
          const { data: cachedData } = await supabase
            .from('usdot_info')
            .select('*')
            .eq('usdot_number', trimmedDOT)
            .maybeSingle();

          let dotData;
          
          if (cachedData && cachedData.basics_data) {
            console.log('Using cached DOT data');
            dotData = cachedData.basics_data;
          } else {
            // Make API call if no cached data
            console.log('Making API request for DOT:', trimmedDOT);
            const { data: apiData, error: apiError } = await supabase.functions.invoke('fetch-usdot-info', {
              body: { dotNumber: trimmedDOT }
            });

            if (apiError) {
              throw apiError;
            }

            if (!apiData || !apiData.items || !apiData.items[0]) {
              throw new Error('No data received from DOT lookup');
            }

            dotData = apiData.items[0];
          }

          // Map and validate the data
          const mappedData = mapAPIResponse(dotData);
          const validatedData = validateDOTData(mappedData);

          if (!validatedData) {
            throw new Error('Invalid data received from API');
          }

          // Transform to USDOTData format
          const transformedData = transformToUSDOTData(mappedData);

          // Store or update the data in usdot_info table
          if (!cachedData) {
            const { error: upsertError } = await supabase
              .from('usdot_info')
              .upsert({
                usdot_number: trimmedDOT,
                basics_data: dotData,
                legal_name: mappedData.legal_name,
                dba_name: mappedData.dba_name,
                api_dba_name: mappedData.api_dba_name,
                api_dba_flag: mappedData.api_dba_flag,
                operating_status: mappedData.operating_status,
                entity_type: mappedData.entity_type,
                physical_address: mappedData.physical_address,
                telephone: mappedData.telephone,
                power_units: mappedData.power_units,
                drivers: mappedData.drivers,
                mcs150_last_update: mappedData.mcs150_last_update,
                out_of_service: mappedData.out_of_service,
                out_of_service_date: mappedData.out_of_service_date,
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
              });

            if (upsertError) {
              console.error('Error storing USDOT info:', upsertError);
            }
          }

          if (existingFiling) {
            console.log('Found existing filing:', existingFiling);
            resolve({ usdotData: transformedData, resumedFiling: existingFiling });
          } else {
            resolve({ usdotData: transformedData });
          }
        } catch (error) {
          console.error('Error in DOT lookup:', error);
          // Return some basic data even if the API call fails
          const basicData: USDOTData = {
            usdotNumber: trimmedDOT,
            legalName: '',
            dbaName: '',
            operatingStatus: '',
            entityType: '',
            physicalAddress: '',
            physicalAddressStreet: '',
            physicalAddressCity: '',
            physicalAddressState: '',
            physicalAddressZip: '',
            physicalAddressCountry: 'USA',
            mailingAddressStreet: '',
            mailingAddressCity: '',
            mailingAddressState: '',
            mailingAddressZip: '',
            mailingAddressCountry: 'USA',
            telephone: '',
            powerUnits: 0,
            drivers: 0,
            insuranceBIPD: 0,
            insuranceBond: 0,
            insuranceCargo: 0,
            riskScore: 'Unknown',
            outOfServiceDate: null,
            mcs150FormDate: null,
            mcs150Date: null,
            mcs150Year: 0,
            mcs150Mileage: 0,
            carrierOperation: '',
            cargoCarried: [],
            busCount: 0,
            limoCount: 0,
            minibusCount: 0,
            motorcoachCount: 0,
            vanCount: 0,
            complaintCount: 0,
            outOfService: false,
            mcNumber: ''
          };
          
          toast({
            title: "Warning",
            description: "Could not fetch complete DOT information. You may continue with basic information.",
            variant: "destructive"
          });
          
          resolve({ usdotData: basicData });
        } finally {
          setIsLoading(false);
        }
      }, DEBOUNCE_TIMEOUT);
    });
  }, [filingType, toast]);

  return { lookupDOT, isLoading };
};
