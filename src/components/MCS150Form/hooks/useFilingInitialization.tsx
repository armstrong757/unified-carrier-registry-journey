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
    if (isInitialized) {
      return;
    }

    const stateData = location.state?.usdotData;
    const resumedFiling = location.state?.resumedFiling;
    
    if (stateData) {
      console.log('Initializing MCS-150 form with state data');
      setUsdotData(stateData);
      
      const initializeFiling = async () => {
        try {
          if (resumedFiling) {
            console.log('Resuming existing MCS-150 filing');
            setFilingId(resumedFiling.id);
            setFormData(resumedFiling.form_data);
            setCurrentStep(resumedFiling.last_step_completed || 1);
          } else {
            console.log('Creating new MCS-150 filing');
            const filing = await createFiling(stateData.usdotNumber, 'mcs150', formData);
            if (filing) {
              setFilingId(filing.id);
            } else {
              throw new Error('Failed to create filing');
            }
          }
          setIsInitialized(true);
        } catch (error) {
          console.error('Error initializing MCS-150 filing:', error);
          if (!location.state?.usdotData) {
            toast({
              title: "Error",
              description: "Failed to initialize filing. Please try again.",
              variant: "destructive",
            });
            navigate('/mcs-150-filing');
          }
        }
      };
      
      initializeFiling();
      return;
    }

    const storedData = sessionStorage.getItem('usdotData');
    if (!storedData) {
      console.log('No DOT data found in session storage');
      toast({
        title: "Error",
        description: "No DOT information found. Please start from the MCS-150 Filing page.",
        variant: "destructive",
      });
      navigate('/mcs-150-filing');
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      if (!parsedData.usdotNumber) {
        throw new Error('Invalid USDOT data');
      }
      console.log('Using stored DOT data for MCS-150');
      setUsdotData(parsedData);
      
      const initializeFiling = async () => {
        try {
          const filing = await createFiling(parsedData.usdotNumber, 'mcs150', formData);
          if (filing) {
            setFilingId(filing.id);
            setIsInitialized(true);
          } else {
            throw new Error('Failed to create filing');
          }
        } catch (error) {
          console.error('Error creating MCS-150 filing:', error);
          toast({
            title: "Error",
            description: "Failed to initialize filing. Please try again.",
            variant: "destructive",
          });
          navigate('/mcs-150-filing');
        }
      };
      
      initializeFiling();
    } catch (error) {
      console.error('Error parsing stored USDOT data:', error);
      toast({
        title: "Error",
        description: "Invalid DOT information. Please try again.",
        variant: "destructive",
      });
      navigate('/mcs-150-filing');
    }
  }, [navigate, toast, location, isInitialized, formData, setFormData, setCurrentStep]);

  return { usdotData, filingId, isInitialized };
};
