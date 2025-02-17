
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

// Type guard
function isUSDOTData(data: unknown): data is USDOTData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'usdotNumber' in data &&
    typeof (data as USDOTData).usdotNumber === 'string'
  );
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
                body: { dotNumber: trimmedDOT, requestSource: `${filingType}_form` }
              })
              .then(({ data, error }) => {
                if (error) throw error;
                if (!isUSDOTData(data)) {
                  throw new Error('Invalid response format from USDOT lookup');
                }
                // Update cache
                responseCache[trimmedDOT] = { data, timestamp: Date.now() };
                return data;
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
