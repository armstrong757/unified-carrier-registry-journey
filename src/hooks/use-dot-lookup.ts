
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { USDOTData } from "@/types/filing";
import { useToast } from "@/components/ui/use-toast";

// Keep track of in-flight requests to prevent duplicates
// Make it global (outside the hook) so it's shared across all instances
const pendingRequests: { [key: string]: Promise<USDOTData> } = {};

// Cache successful responses
const responseCache: { [key: string]: { data: USDOTData; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Request debounce timeout
const DEBOUNCE_TIMEOUT = 300; // 300ms
let debounceTimer: NodeJS.Timeout;

// Updated type guard to match the test data format
function isUSDOTData(data: unknown): data is USDOTData {
  const d = data as any;
  return (
    typeof d === 'object' &&
    d !== null &&
    (
      // Check for usdot_number (from test data) or usdotNumber (from existing format)
      (typeof d.usdot_number === 'string' || typeof d.usdotNumber === 'string') &&
      // Check for legal_name or legalName
      (typeof d.legal_name === 'string' || typeof d.legalName === 'string')
    )
  );
}

// Transform API response to match USDOTData type
function transformResponse(data: any): USDOTData {
  console.log('Transforming API response:', data); // Debug log
  
  // Helper function to handle null/undefined values
  const getValueOrDefault = (value: any, defaultValue: any) => {
    return value !== null && value !== undefined ? value : defaultValue;
  };

  // Convert string numbers to actual numbers
  const toNumber = (value: any) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return typeof value === 'number' ? value : 0;
  };

  return {
    usdotNumber: data.usdot_number || data.usdotNumber,
    legalName: data.legal_name || data.legalName,
    dbaName: getValueOrDefault(data.dba_name || data.dbaName, ''),
    operatingStatus: getValueOrDefault(data.operating_status || data.operatingStatus, 'ACTIVE'),
    entityType: getValueOrDefault(data.entity_type || data.entityType, 'CARRIER'),
    physicalAddress: getValueOrDefault(data.physical_address || data.physicalAddress, ''),
    telephone: getValueOrDefault(data.telephone || data.phone, ''),
    powerUnits: toNumber(data.power_units || data.powerUnits),
    drivers: toNumber(data.drivers || data.total_drivers),
    insuranceBIPD: toNumber(data.insurance_bipd || data.insuranceBIPD),
    insuranceBond: toNumber(data.insurance_bond || data.insuranceBond),
    insuranceCargo: toNumber(data.insurance_cargo || data.insuranceCargo),
    riskScore: getValueOrDefault(data.risk_score || data.riskScore, 'Unknown'),
    outOfServiceDate: data.out_of_service_date || data.outOfServiceDate || null,
    mcs150FormDate: data.mcs150_last_update || data.mcs150FormDate || null,
    carrierOperation: getValueOrDefault(data.carrier_operation || data.carrierOperation, ''),
    cargoCarried: Array.isArray(data.cargo_carried || data.cargoCarried) 
      ? data.cargo_carried || data.cargoCarried 
      : []
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

    // Clear any existing debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Return a promise that resolves after the debounce period
    return new Promise((resolve) => {
      debounceTimer = setTimeout(async () => {
        setIsLoading(true);
        
        try {
          // Check memory cache first
          const now = Date.now();
          const cachedResponse = responseCache[trimmedDOT];
          if (cachedResponse && (now - cachedResponse.timestamp) < CACHE_DURATION) {
            console.log('Using memory cache for DOT:', trimmedDOT);
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
            let usdotData: USDOTData;
            if (typeof existingFiling.form_data === 'object' && existingFiling.form_data !== null) {
              const formData = existingFiling.form_data;
              
              if ('usdotData' in formData && isUSDOTData(formData.usdotData)) {
                usdotData = formData.usdotData;
              } else if (isUSDOTData(formData)) {
                usdotData = formData;
              } else {
                throw new Error('Invalid USDOT data format in filing');
              }
              
              // Update cache
              responseCache[trimmedDOT] = { data: usdotData, timestamp: now };
              resolve({ usdotData, resumedFiling: existingFiling });
              return;
            }
          }

          // Deduplicate API calls
          if (!pendingRequests[trimmedDOT]) {
            console.log('Making new API request for DOT:', trimmedDOT);
            pendingRequests[trimmedDOT] = supabase.functions
              .invoke('fetch-usdot-info', {
                body: { 
                  dotNumber: trimmedDOT, 
                  requestSource: `${filingType}_form`,
                  testMode: true // Enable test mode for verification
                }
              })
              .then(({ data, error }) => {
                if (error) throw error;
                console.log('Received API response:', data); // Debug log
                const transformedData = transformResponse(data);
                if (!isUSDOTData(transformedData)) {
                  console.error('Invalid data format:', transformedData); // Debug log
                  throw new Error('Invalid response format from USDOT lookup');
                }
                // Update cache
                responseCache[trimmedDOT] = { data: transformedData, timestamp: Date.now() };
                return transformedData;
              })
              .finally(() => {
                delete pendingRequests[trimmedDOT];
              });
          }

          const data = await pendingRequests[trimmedDOT];
          resolve({ usdotData: data });

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
