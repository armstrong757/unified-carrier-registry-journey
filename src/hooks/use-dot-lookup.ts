import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { USDOTData } from "@/types/filing";
import { useToast } from "@/components/ui/use-toast";

// Keep track of in-flight requests to prevent duplicates
const pendingRequests: { [key: string]: Promise<USDOTData> } = {};

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
      // Check sessionStorage first
      const cachedData = sessionStorage.getItem('usdotData');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (isUSDOTData(parsedData) && parsedData.usdotNumber === trimmedDOT) {
          console.log('Using sessionStorage data for DOT:', trimmedDOT);
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
          
          sessionStorage.setItem('usdotData', JSON.stringify(usdotData));
          return { usdotData, resumedFiling: existingFiling };
        }
      }

      // Deduplicate API calls
      if (!pendingRequests[trimmedDOT]) {
        pendingRequests[trimmedDOT] = supabase.functions
          .invoke('fetch-usdot-info', {
            body: { dotNumber: trimmedDOT, requestSource: `${filingType}_form` }
          })
          .then(({ data, error }) => {
            if (error) throw error;
            if (!isUSDOTData(data)) {
              throw new Error('Invalid response format from USDOT lookup');
            }
            return data;
          })
          .finally(() => {
            // Clean up pending request
            delete pendingRequests[trimmedDOT];
          });
      }

      const data = await pendingRequests[trimmedDOT];
      sessionStorage.setItem('usdotData', JSON.stringify(data));
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
