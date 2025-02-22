
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { createFiling } from "@/utils/filing";

interface UseFilingInitializationProps {
  formData: any;
  setFormData: (data: any) => void;
  setCurrentStep: (step: number) => void;
}

export const useFilingInitialization = ({
  formData,
  setFormData,
  setCurrentStep
}: UseFilingInitializationProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [usdotData, setUsdotData] = useState<any>(null);
  const [filingId, setFilingId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    const initializeFiling = async (data: any) => {
      try {
        const resumedFiling = location.state?.resumedFiling;
        
        if (resumedFiling) {
          console.log('Resuming existing filing');
          setFilingId(resumedFiling.id);
          setFormData(resumedFiling.form_data);
          setCurrentStep(resumedFiling.last_step_completed || 1);
          // Set the USDOT data from the form_data
          if (resumedFiling.form_data.usdotData) {
            setUsdotData(resumedFiling.form_data.usdotData);
          }
          setIsInitialized(true);
          return;
        }

        console.log('Creating new filing');
        const filing = await createFiling(data.usdotNumber, 'mcs150', {
          ...formData,
          usdotData: data
        });

        if (filing) {
          setFilingId(filing.id);
          setUsdotData(data);
          setIsInitialized(true);
        } else {
          throw new Error('Failed to create filing');
        }
      } catch (error) {
        console.error('Error in initializeFiling:', error);
        sessionStorage.removeItem('usdotData');
        toast({
          title: "Error",
          description: "Failed to start filing. Please try again.",
          variant: "destructive",
        });
        navigate('/mcs-150-filing', { replace: true });
      }
    };

    // First try to get data from location state
    const stateData = location.state?.usdotData;
    if (stateData) {
      console.log('Using state data');
      setUsdotData(stateData);
      sessionStorage.setItem('usdotData', JSON.stringify(stateData));
      initializeFiling(stateData);
      return;
    }

    // Then try session storage
    const storedData = sessionStorage.getItem('usdotData');
    if (!storedData) {
      console.log('No stored data found');
      toast({
        title: "Error",
        description: "No DOT information found. Please start over.",
        variant: "destructive",
      });
      navigate('/mcs-150-filing', { replace: true });
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      if (!parsedData.usdotNumber) {
        throw new Error('Invalid USDOT data');
      }
      console.log('Using stored data');
      setUsdotData(parsedData);
      initializeFiling(parsedData);
    } catch (error) {
      console.error('Error parsing stored data:', error);
      sessionStorage.removeItem('usdotData');
      toast({
        title: "Error",
        description: "Invalid DOT data. Please start over.",
        variant: "destructive",
      });
      navigate('/mcs-150-filing', { replace: true });
    }
  }, [location, isInitialized, formData, setFormData, setCurrentStep, navigate, toast]);

  return { usdotData, filingId, isInitialized };
};
