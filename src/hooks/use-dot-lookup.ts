import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { USDOTData } from "@/types/filing";
import { useToast } from "@/components/ui/use-toast";

const DEBOUNCE_TIMEOUT = 300;
let debounceTimer: NodeJS.Timeout;

function transformResponse(data: any): USDOTData {
  console.log('Transforming API response:', data);
  
  const transformed: USDOTData = {
    usdotNumber: data.dot_number || '',
    legalName: data.legal_name || '',
    dbaName: data.dba_name || '',
    operatingStatus: data.usdot_status || 'NOT AUTHORIZED',
    entityType: data.entity_type_desc || '',
    physicalAddress: [
      data.physical_address_street,
      data.physical_address_city,
      data.physical_address_state,
      data.physical_address_zip_code
    ].filter(Boolean).join(', ') || '',
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
    cargoCarried: [],
    busCount: 0,
    limoCount: 0,
    minibusCount: 0,
    motorcoachCount: 0,
    vanCount: 0,
    complaintCount: 0,
    outOfService: data.out_of_service_flag || false,
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
