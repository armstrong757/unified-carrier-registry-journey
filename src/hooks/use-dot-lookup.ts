
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { USDOTData } from "@/types/filing";
import { useToast } from "@/components/ui/use-toast";
import { validateDOTData } from "@/utils/dot-data-validation";
import { mapAPIResponse } from "@/utils/dot-api-mapper";

const DEBOUNCE_TIMEOUT = 300;
let debounceTimer: NodeJS.Timeout;

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

    return new Promise((resolve, reject) => {
      debounceTimer = setTimeout(async () => {
        setIsLoading(true);
        
        try {
          // First check cache
          const { data: cachedData } = await supabase
            .from('usdot_info')
            .select('basics_data')
            .eq('usdot_number', trimmedDOT)
            .maybeSingle();

          let dotData;
          
          if (cachedData?.basics_data) {
            console.log('Using cached DOT data');
            dotData = cachedData.basics_data;
          } else {
            // Make API call if no cache
            console.log('Making API request for DOT:', trimmedDOT);
            const { data: apiData, error: apiError } = await supabase.functions.invoke('fetch-usdot-info', {
              body: { dotNumber: trimmedDOT }
            });

            if (apiError) {
              console.error('API Error:', apiError);
              throw apiError;
            }

            if (!apiData?.items?.[0]) {
              throw new Error('No data received from DOT lookup');
            }

            dotData = apiData.items[0];
            console.log('Received DOT data:', dotData);

            // Store the raw data in the database
            const { error: upsertError } = await supabase
              .from('usdot_info')
              .upsert({
                usdot_number: trimmedDOT,
                basics_data: dotData,
                updated_at: new Date().toISOString()
              });

            if (upsertError) {
              console.error('Error storing USDOT info:', upsertError);
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

          // Map and validate the data
          const mappedData = mapAPIResponse(dotData);
          console.log('Mapped data:', mappedData);
          
          const validatedData = validateDOTData(mappedData);
          if (!validatedData) {
            throw new Error('Invalid data received from API');
          }

          if (existingFiling) {
            console.log('Found existing filing:', existingFiling);
            resolve({ usdotData: mappedData, resumedFiling: existingFiling });
          } else {
            resolve({ usdotData: mappedData });
          }

        } catch (error: any) {
          console.error('Error in DOT lookup:', error);
          toast({
            title: "Error",
            description: error.message || "Failed to fetch DOT information. Please try again.",
            variant: "destructive"
          });
          reject(error);
        } finally {
          setIsLoading(false);
        }
      }, DEBOUNCE_TIMEOUT);
    });
  }, [filingType, toast]);

  return { lookupDOT, isLoading };
};
