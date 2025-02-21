
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
  
  // Parse physical address
  const physicalAddress = parseAddress(data.physical_address);
  const mailingAddress = parseAddress(data.mailing_address || data.physical_address);
  
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
    usdotNumber: data.dot_number || '',
    legalName: data.legal_name || '',
    dbaName: data.dba_name || '',
    operatingStatus: data.usdot_status || 'NOT AUTHORIZED',
    entityType: data.entity_type_desc || '',
    physicalAddress: data.physical_address || '',
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
    telephone: data.telephone_number || '',
    powerUnits: Number(data.total_power_units) || 0,
    drivers: Number(data.total_drivers) || 0,
    insuranceBIPD: Number(data.insurance_bipd_on_file) || 0,
    insuranceBond: Number(data.insurance_bond_on_file) || 0,
    insuranceCargo: Number(data.insurance_cargo_on_file) || 0,
    riskScore: data.risk_score || 'Unknown',
    outOfServiceDate: data.out_of_service_date || null,
    mcs150FormDate: data.mcs150_form_date || null,
    mcs150Date: data.mcs150_date || null,
    mcs150Year: Number(data.mcs150_year) || 0,
    mcs150Mileage: Number(data.mcs150_mileage) || 0,
    carrierOperation: data.carrier_operation || '',
    cargoCarried: data.cargo_carried || [],
    busCount: Number(data.total_buses) || 0,
    limoCount: Number(data.total_limousines) || 0,
    minibusCount: Number(data.total_minibuses) || 0,
    motorcoachCount: Number(data.total_motorcoaches) || 0,
    vanCount: Number(data.total_vans) || 0,
    complaintCount: Number(data.complaint_count) || 0,
    outOfService: Boolean(data.out_of_service_flag),
    mcNumber: data.docket || ''
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

          if (existingFiling) {
            console.log('Found existing filing:', existingFiling);
            const usdotData = transformResponse(existingFiling.form_data);
            resolve({ usdotData, resumedFiling: existingFiling });
            setIsLoading(false);
            return;
          }

          // If no existing filing, fetch from API
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

          // Store the address data in usdot_info table
          const { error: upsertError } = await supabase
            .from('usdot_info')
            .upsert({
              usdot_number: trimmedDOT,
              physical_address_street: transformedData.physicalAddressStreet,
              physical_address_city: transformedData.physicalAddressCity,
              physical_address_state: transformedData.physicalAddressState,
              physical_address_zip: transformedData.physicalAddressZip,
              physical_address_country: transformedData.physicalAddressCountry,
              mailing_address_street: transformedData.mailingAddressStreet,
              mailing_address_city: transformedData.mailingAddressCity,
              mailing_address_state: transformedData.mailingAddressState,
              mailing_address_zip: transformedData.mailingAddressZip,
              mailing_address_country: transformedData.mailingAddressCountry,
              basics_data: data.items[0],
              bus_count: Number(data.items[0].total_buses) || 0,
              complaint_count: Number(data.items[0].complaint_count) || 0,
              dba_name: data.items[0].dba_name || '',
              drivers: Number(data.items[0].total_drivers) || 0,
              ein: data.items[0].ein || '',
              entity_type: data.items[0].entity_type_desc || '',
              legal_name: data.items[0].legal_name || '',
              limo_count: Number(data.items[0].total_limousines) || 0,
              mc_number: data.items[0].docket || '',
              mcs150_last_update: data.items[0].mcs150_form_date || null,
              mileage_year: `${Number(data.items[0].mcs150_mileage) || 0} (${Number(data.items[0].mcs150_year) || 0})`,
              minibus_count: Number(data.items[0].total_minibuses) || 0,
              motorcoach_count: Number(data.items[0].total_motorcoaches) || 0,
              operating_status: data.items[0].usdot_status || 'NOT AUTHORIZED',
              out_of_service: data.items[0].out_of_service_flag || false,
              out_of_service_date: data.items[0].out_of_service_date || null,
              physical_address: data.items[0].physical_address || '',
              power_units: Number(data.items[0].total_power_units) || 0,
              telephone: data.items[0].telephone_number || '',
              van_count: Number(data.items[0].total_vans) || 0,
            });

          if (upsertError) {
            console.error('Error storing address data:', upsertError);
          }

          resolve({ usdotData: transformedData });

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
