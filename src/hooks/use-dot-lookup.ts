
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { USDOTData } from "@/types/filing";
import { useToast } from "@/components/ui/use-toast";

const DEBOUNCE_TIMEOUT = 300;
let debounceTimer: NodeJS.Timeout;

function parseAddress(addressString: string) {
  if (!addressString) return null;
  
  // Expected format: "street, city, state zipcode"
  const parts = addressString.split(',').map(part => part.trim());
  
  if (parts.length >= 3) {
    const street = parts[0];
    const city = parts[1];
    // Last part contains state and zip
    const stateZip = parts[parts.length - 1].split(' ');
    const state = stateZip[0];
    const zip = stateZip[1];

    return {
      street,
      city,
      state,
      zip,
      country: 'USA'
    };
  }
  
  return null;
}

function transformResponse(data: any): USDOTData {
  console.log('Transforming API response:', data);
  
  // Check if we're getting the basics_data from usdot_info table
  const basicData = data.basics_data || data;
  
  // Parse physical address
  const physicalAddress = parseAddress(basicData.physical_address);
  const mailingAddress = parseAddress(basicData.mailing_address || basicData.physical_address);
  
  // Set default values
  const defaultAddress = {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA'
  };

  // Use parsed addresses or defaults
  const physical = physicalAddress || defaultAddress;
  const mailing = mailingAddress || physical;

  const transformed: USDOTData = {
    usdotNumber: basicData.dot_number || data.usdot_number || '',
    legalName: basicData.legal_name || data.legal_name || '',
    dbaName: basicData.dba_name || data.dba_name || '',
    operatingStatus: basicData.usdot_status || data.operating_status || 'NOT AUTHORIZED',
    entityType: basicData.entity_type_desc || data.entity_type || '',
    physicalAddress: basicData.physical_address || data.physical_address || '',
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
    telephone: basicData.telephone_number || data.telephone || '',
    powerUnits: Number(basicData.total_power_units || data.power_units) || 0,
    drivers: Number(basicData.total_drivers || data.drivers) || 0,
    insuranceBIPD: Number(basicData.insurance_bipd_on_file) || 0,
    insuranceBond: Number(basicData.insurance_bond_on_file) || 0,
    insuranceCargo: Number(basicData.insurance_cargo_on_file) || 0,
    riskScore: basicData.risk_score || data.risk_score || 'Unknown',
    outOfServiceDate: basicData.out_of_service_date || data.out_of_service_date || null,
    mcs150FormDate: basicData.mcs150_form_date || data.mcs150_last_update || null,
    mcs150Date: basicData.mcs150_date || data.mcs150_last_update || null,
    mcs150Year: Number(basicData.mcs150_year) || 0,
    mcs150Mileage: Number(basicData.mcs150_mileage) || 0,
    carrierOperation: basicData.carrier_operation || '',
    cargoCarried: basicData.cargo_carried || [],
    busCount: Number(basicData.total_buses || data.bus_count) || 0,
    limoCount: Number(basicData.total_limousines || data.limo_count) || 0,
    minibusCount: Number(basicData.total_minibuses || data.minibus_count) || 0,
    motorcoachCount: Number(basicData.total_motorcoaches || data.motorcoach_count) || 0,
    vanCount: Number(basicData.total_vans || data.van_count) || 0,
    complaintCount: Number(basicData.complaint_count) || 0,
    outOfService: Boolean(basicData.out_of_service_flag || data.out_of_service),
    mcNumber: basicData.docket || data.mc_number || ''
  };

  console.log('Transformed USDOT data:', transformed);
  return transformed;
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

          // First try to get data from usdot_info table
          const { data: usdotInfo, error: usdotInfoError } = await supabase
            .from('usdot_info')
            .select('*')
            .eq('usdot_number', trimmedDOT)
            .maybeSingle();

          if (existingFiling) {
            console.log('Found existing filing:', existingFiling);
            const usdotData = transformResponse(usdotInfo || existingFiling.form_data);
            resolve({ usdotData, resumedFiling: existingFiling });
            setIsLoading(false);
            return;
          }

          // If no existing filing or usdot_info, fetch from API
          if (!usdotInfo) {
            console.log('Making new API request for DOT:', trimmedDOT);
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

            const transformedData = transformResponse(data.items[0]);

            // Store the data in usdot_info table
            const { error: upsertError } = await supabase
              .from('usdot_info')
              .upsert({
                usdot_number: trimmedDOT,
                basics_data: data.items[0],
                // ... additional fields
              });

            if (upsertError) {
              console.error('Error storing USDOT info:', upsertError);
            }

            resolve({ usdotData: transformedData });
          } else {
            // Use existing USDOT info
            console.log('Using existing USDOT info:', usdotInfo);
            resolve({ usdotData: transformResponse(usdotInfo) });
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
