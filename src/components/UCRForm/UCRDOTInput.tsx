
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBotProtection } from "@/hooks/use-bot-protection";
import { USDOTData } from "@/types/filing";

// Type guard to check if an unknown value is a USDOTData
function isUSDOTData(data: unknown): data is USDOTData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'usdotNumber' in data &&
    typeof (data as USDOTData).usdotNumber === 'string'
  );
}

export const UCRDOTInput = () => {
  const [dotNumber, setDotNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { honeypot, setHoneypot, checkBotAttempt } = useBotProtection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checkBotAttempt()) {
      return;
    }

    if (!dotNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a DOT number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // First check sessionStorage for existing data
      const cachedData = sessionStorage.getItem('usdotData');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (isUSDOTData(parsedData) && parsedData.usdotNumber === dotNumber.trim()) {
          console.log('Using sessionStorage data for DOT:', dotNumber);
          navigate("/ucr", {
            state: {
              usdotData: parsedData
            }
          });
          return;
        }
      }

      // Check for existing draft UCR filing
      const { data: existingFiling, error: filingError } = await supabase
        .from('filings')
        .select('*')
        .eq('usdot_number', dotNumber.trim())
        .eq('filing_type', 'ucr')
        .eq('status', 'draft')
        .gt('resume_token_expires_at', new Date().toISOString())
        .maybeSingle();

      if (filingError) {
        console.error('Error checking for existing filing:', filingError);
        throw new Error('Failed to check for existing filing');
      }

      if (existingFiling) {
        toast({
          title: "Welcome Back!",
          description: "We saved your progress. You can continue where you left off.",
        });
        
        // Safely extract USDOT data from form_data
        let usdotData: USDOTData;
        if (typeof existingFiling.form_data === 'object' && existingFiling.form_data !== null) {
          const formData = existingFiling.form_data;
          
          // Check if usdotData exists in form_data
          if ('usdotData' in formData && isUSDOTData(formData.usdotData)) {
            usdotData = formData.usdotData;
          } else if (isUSDOTData(formData)) {
            // If not, check if form_data itself is USDOTData
            usdotData = formData;
          } else {
            throw new Error('Invalid USDOT data format in filing');
          }
          
          sessionStorage.setItem('usdotData', JSON.stringify(usdotData));
          navigate("/ucr", {
            state: {
              usdotData,
              resumedFiling: existingFiling
            }
          });
          return;
        }
      }

      const { data, error } = await supabase.functions.invoke('fetch-usdot-info', {
        body: {
          dotNumber: dotNumber.trim(),
          requestSource: 'ucr_form'
        }
      });
      
      if (error) throw error;
      
      if (!isUSDOTData(data)) {
        throw new Error('Invalid response format from USDOT lookup');
      }
      
      sessionStorage.setItem('usdotData', JSON.stringify(data));
      navigate("/ucr", {
        state: {
          usdotData: data
        }
      });
    } catch (error) {
      console.error('Error fetching USDOT info:', error);
      toast({
        title: "Error",
        description: "Failed to fetch DOT information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto p-8 bg-white shadow-lg border-0">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold text-center mb-6">Enter DOT Number To Start</h2>
        <Input 
          type="text" 
          placeholder="Enter USDOT Number here" 
          value={dotNumber} 
          onChange={e => setDotNumber(e.target.value)} 
          className="w-full text-lg py-6" 
          disabled={isLoading} 
        />
        <Input
          type="text"
          name="username"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          style={{ display: 'none' }}
        />
        <div className="flex justify-center">
          <Button type="submit" className="bg-[#517fa4] hover:bg-[#517fa4]/90 text-white py-6 text-lg px-8" disabled={isLoading}>
            {isLoading ? "LOADING..." : "GET STARTED"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
