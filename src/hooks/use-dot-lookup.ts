import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { USDOTData } from "@/types/filing";
import { useToast } from "@/components/ui/use-toast";

// Keep track of in-flight requests to prevent duplicates
// Make it global (outside the hook) so it's shared across all instances
const pendingRequests: { [key: string]: Promise<USDOTData> } = {};

// Also cache successful responses globally
const responseCache: { [key: string]: { data: USDOTData; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

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

    setIsLoading(true);
    
    try {
      // Check memory cache first (fastest)
      const now = Date.now();
      const cachedResponse = responseCache[trimmedDOT];
      if (cachedResponse && (now - cachedResponse.timestamp) < CACHE_DURATION) {
        console.log('Using memory cache for DOT:', trimmedDOT);
        return { usdotData: cachedResponse.data };
      }

      // Check sessionStorage next (second fastest)
      const cachedData = sessionStorage.getItem('usdotData');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (isUSDOTData(parsedData) && parsedData.usdotNumber === trimmedDOT) {
          console.log('Using sessionStorage data for DOT:', trimmedDOT);
          // Update memory cache
          responseCache[trimmedDOT] = { data: parsedData, timestamp: now };
          return { usdotData: parsedData };
        }
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
          
          // Update both caches
          sessionStorage.setItem('usdotData', JSON.stringify(usdotData));
          responseCache[trimmedDOT] = { data: usdotData, timestamp: now };
          return { usdotData, resumedFiling: existingFiling };
        }
      }

      // Deduplicate API calls across all form types
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
            // Update both caches with the new data
            responseCache[trimmedDOT] = { data, timestamp: Date.now() };
            sessionStorage.setItem('usdotData', JSON.stringify(data));
            return data;
          })
          .finally(() => {
            // Clean up pending request
            delete pendingRequests[trimmedDOT];
          });
      } else {
        console.log('Using pending request for DOT:', trimmedDOT);
      }

      const data = await pendingRequests[trimmedDOT];
      return { usdotData: data };

    } catch (error) {
      console.error('Error in DOT lookup:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch DOT information",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [filingType, toast]);

  return { lookupDOT, isLoading };
};
