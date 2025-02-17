
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { USDOTData } from "@/types/filing";
import { useToast } from "@/components/ui/use-toast";

const pendingRequests: { [key: string]: Promise<USDOTData> } = {};
const responseCache: { [key: string]: { data: USDOTData; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000;
const DEBOUNCE_TIMEOUT = 300;
let debounceTimer: NodeJS.Timeout;

function isUSDOTData(data: unknown): data is USDOTData {
  if (!data || typeof data !== 'object') return false;
  
  const d = data as any;
  const hasRequiredFields = (
    (typeof d.usdot_number === 'string' || typeof d.usdotNumber === 'string') &&
    (typeof d.legal_name === 'string' || typeof d.legalName === 'string')
  );
  
  if (!hasRequiredFields) {
    console.error('Missing required fields in USDOT data:', data);
    return false;
  }
  
  return true;
}

function transformResponse(data: any): USDOTData {
  console.log('Transforming API response:', data);

  // Format MCS-150 date properly
  const formatMCS150Date = (year: number | string | null) => {
    if (!year) return null;
    return `06/28/${year}`; // Using June 28th as per business requirements
  };
  
  // Handle both the API response format and the stored format
  const transformed: USDOTData = {
    usdotNumber: data.dot_number || data.usdot_number || data.usdotNumber || '',
    legalName: data.legal_name || data.legalName || 'Unknown',
    dbaName: data.dba_name || data.dbaName || '',
    operatingStatus: 'NOT AUTHORIZED', // As per business requirement, this should always be NOT AUTHORIZED
    entityType: data.entity_type_desc || data.entity_type || data.entityType || 'CARRIER',
    physicalAddress: data.physical_address || data.physicalAddress || '',
    telephone: data.telephone_number || data.telephone || data.phone || '',
    powerUnits: Number(data.total_power_units || data.power_units || data.powerUnits) || 0,
    drivers: Number(data.total_drivers || data.drivers) || 0,
    insuranceBIPD: Number(data.insurance_bipd_on_file || data.insurance_bipd || data.insuranceBIPD) || 0,
    insuranceBond: Number(data.insurance_bond_on_file || data.insurance_bond || data.insuranceBond) || 0,
    insuranceCargo: Number(data.insurance_cargo_on_file || data.insurance_cargo || data.insuranceCargo) || 0,
    riskScore: data.risk_score || data.riskScore || 'Unknown',
    outOfServiceDate: data.out_of_service_date || data.outOfServiceDate || null,
    mcs150FormDate: formatMCS150Date(data.mcs150_last_update || data.mcs150_year),
    mcs150Year: Number(data.mcs150_last_update || data.mcs150_year) || 0,
    mcs150Mileage: Number(data.mcs150_miles || data.mcs150_mileage) || 0,
    carrierOperation: data.carrier_operation || data.carrierOperation || '',
    cargoCarried: Array.isArray(data.cargo_carried || data.cargoCarried) 
      ? data.cargo_carried || data.cargoCarried 
      : []
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
          const now = Date.now();
          const cachedResponse = responseCache[trimmedDOT];
          if (cachedResponse && (now - cachedResponse.timestamp) < CACHE_DURATION) {
            console.log('Using cached USDOT data:', cachedResponse.data);
            resolve({ usdotData: cachedResponse.data });
            return;
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

          if (existingFiling) {
            console.log('Found existing filing:', existingFiling);
            try {
              let usdotData: USDOTData;
              
              if (existingFiling.form_data && typeof existingFiling.form_data === 'object') {
                if ('usdotData' in existingFiling.form_data) {
                  usdotData = transformResponse(existingFiling.form_data.usdotData);
                } else {
                  usdotData = transformResponse(existingFiling.form_data);
                }
              } else {
                throw new Error('Invalid form data structure in filing');
              }

              if (!isUSDOTData(usdotData)) {
                throw new Error('Invalid USDOT data format in filing');
              }

              responseCache[trimmedDOT] = { data: usdotData, timestamp: now };
              resolve({ usdotData, resumedFiling: existingFiling });
              return;
            } catch (error) {
              console.error('Error processing existing filing:', error);
            }
          }

          console.log('Making new API request for DOT:', trimmedDOT);
          const { data, error } = await supabase.functions.invoke('fetch-usdot-info', {
            body: { 
              dotNumber: trimmedDOT, 
              requestSource: `${filingType}_form`,
              testMode: false // Now using live mode
            }
          });

          if (error) {
            console.error('Edge function error:', error);
            throw new Error(error.message || 'Failed to fetch DOT information');
          }

          if (!data) {
            throw new Error('No data received from DOT lookup');
          }

          console.log('Received API response:', data);
          const transformedData = transformResponse(data);
          
          if (!isUSDOTData(transformedData)) {
            throw new Error('Invalid response format from USDOT lookup');
          }

          responseCache[trimmedDOT] = { data: transformedData, timestamp: now };
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
