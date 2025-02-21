
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
  
  // If basics_data is empty, use the root data
  const basicData = (data.basics_data && Object.keys(data.basics_data).length > 0) ? data.basics_data : data;
  
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
  const physical = physicalAddress || {
    street: data.api_physical_address_street || basicData.physical_address_street || defaultAddress.street,
    city: data.api_physical_address_city || basicData.physical_address_city || defaultAddress.city,
    state: data.api_physical_address_state || basicData.physical_address_state || defaultAddress.state,
    zip: data.api_physical_address_zip || basicData.physical_address_zip_code || defaultAddress.zip,
    country: data.api_physical_address_country || basicData.physical_address_country || defaultAddress.country
  };

  const mailing = mailingAddress || {
    street: data.api_mailing_address_street || basicData.mailing_address_street || physical.street,
    city: data.api_mailing_address_city || basicData.mailing_address_city || physical.city,
    state: data.api_mailing_address_state || basicData.mailing_address_state || physical.state,
    zip: data.api_mailing_address_zip || basicData.mailing_address_zip_code || physical.zip,
    country: data.api_mailing_address_country || basicData.mailing_address_country || physical.country
  };

  const transformed: USDOTData = {
    usdotNumber: data.usdot_number || basicData.dot_number || '',
    legalName: data.legal_name || basicData.legal_name || '',
    dbaName: data.dba_name || basicData.dba_name || '',
    operatingStatus: data.operating_status || basicData.usdot_status || 'NOT AUTHORIZED',
    entityType: data.entity_type || basicData.entity_type_desc || '',
    physicalAddress: data.physical_address || basicData.physical_address || '',
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
    telephone: data.telephone || basicData.telephone_number || '',
    powerUnits: Number(data.power_units || basicData.total_power_units) || 0,
    drivers: Number(data.drivers || basicData.total_drivers) || 0,
    insuranceBIPD: Number(basicData.insurance_bipd_on_file) || 0,
    insuranceBond: Number(basicData.insurance_bond_on_file) || 0,
    insuranceCargo: Number(basicData.insurance_cargo_on_file) || 0,
    riskScore: data.risk_score || basicData.risk_score || 'Unknown',
    outOfServiceDate: data.out_of_service_date || basicData.out_of_service_date || null,
    mcs150FormDate: data.mcs150_last_update || basicData.mcs150_form_date || null,
    mcs150Date: data.mcs150_last_update || basicData.mcs150_date || null,
    mcs150Year: Number(data.mcs150_year || basicData.mcs150_year) || 0,
    mcs150Mileage: Number(data.mcs150_mileage || basicData.mcs150_mileage) || 0,
    carrierOperation: data.carrier_operation || basicData.carrier_operation || '',
    cargoCarried: data.cargo_carried || basicData.cargo_carried || [],
    busCount: Number(data.bus_count || basicData.total_buses) || 0,
    limoCount: Number(data.limo_count || basicData.total_limousines) || 0,
    minibusCount: Number(data.minibus_count || basicData.total_minibuses) || 0,
    motorcoachCount: Number(data.motorcoach_count || basicData.total_motorcoaches) || 0,
    vanCount: Number(data.van_count || basicData.total_vans) || 0,
    complaintCount: Number(data.complaint_count || basicData.complaint_count) || 0,
    outOfService: Boolean(data.out_of_service || basicData.out_of_service_flag),
    mcNumber: data.mc_number || basicData.docket || ''
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

          // Always make a fresh API call to get the latest data
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

          const transformedData = transformResponse(data.items[0]);

          // Store or update the data in usdot_info table
          const { error: upsertError } = await supabase
            .from('usdot_info')
            .upsert({
              usdot_number: trimmedDOT,
              basics_data: data.items[0],
              legal_name: transformedData.legalName,
              dba_name: transformedData.dbaName,
              operating_status: transformedData.operatingStatus,
              entity_type: transformedData.entityType,
              physical_address: transformedData.physicalAddress,
              telephone: transformedData.telephone,
              power_units: transformedData.powerUnits,
              drivers: transformedData.drivers,
              mcs150_last_update: transformedData.mcs150Date,
              out_of_service: transformedData.outOfService,
              out_of_service_date: transformedData.outOfServiceDate,
              api_physical_address_street: transformedData.physicalAddressStreet,
              api_physical_address_city: transformedData.physicalAddressCity,
              api_physical_address_state: transformedData.physicalAddressState,
              api_physical_address_zip: transformedData.physicalAddressZip,
              api_physical_address_country: transformedData.physicalAddressCountry,
              api_mailing_address_street: transformedData.mailingAddressStreet,
              api_mailing_address_city: transformedData.mailingAddressCity,
              api_mailing_address_state: transformedData.mailingAddressState,
              api_mailing_address_zip: transformedData.mailingAddressZip,
              api_mailing_address_country: transformedData.mailingAddressCountry,
            });

          if (upsertError) {
            console.error('Error storing USDOT info:', upsertError);
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
