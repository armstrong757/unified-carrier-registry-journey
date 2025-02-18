import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { createFiling, updateFilingData } from "@/utils/filing";

export const useUCRForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [usdotData, setUsdotData] = useState<any>(null);
  const [filingId, setFilingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    registrationYear: new Date().getFullYear() + 1,
    representative: "", // Changed from first/last name to full name
    email: "",
    phone: "",
    authorization: false,
    classifications: {
      motorCarrier: false,
      motorPrivate: false,
      freightForwarder: false,
      broker: false,
      leasingCompany: false,
    },
    straightTrucks: 0,
    powerUnits: 0,
    passengerVehicles: 0,
    needsVehicleChanges: "no",
    addVehicles: 0,
    excludeVehicles: 0,
    cardType: "credit",
    termsAccepted: false,
  });

  useEffect(() => {
    const stateData = location.state?.usdotData;
    const resumedFiling = location.state?.resumedFiling;
    
    if (stateData) {
      setUsdotData(stateData);
      
      const initializeFiling = async () => {
        try {
          if (resumedFiling) {
            // Sanitize credit card info from resumed filing data
            const { cardNumber, expiryDate, cvv, cardName, ...sanitizedFormData } = resumedFiling.form_data;
            setFilingId(resumedFiling.id);
            setFormData(sanitizedFormData);
            setCurrentStep(resumedFiling.last_step_completed || 1);
          } else {
            // Initialize form data with powerUnits from USDOT data
            const initialFormData = {
              ...formData,
              powerUnits: stateData.powerUnits || 0,
              straightTrucks: stateData.powerUnits || 0
            };
            const filing = await createFiling(stateData.usdotNumber, 'ucr', initialFormData);
            setFilingId(filing.id);
            setFormData(initialFormData);
          }
        } catch (error) {
          console.error('Error initializing filing:', error);
          toast({
            title: "Error",
            description: "Failed to initialize filing. Please try again.",
            variant: "destructive",
          });
        }
      };
      
      initializeFiling();
      return;
    }

    const storedData = sessionStorage.getItem('usdotData');
    if (!storedData) {
      toast({
        title: "Error",
        description: "No DOT information found. Please start from the UCR Filing page.",
        variant: "destructive",
      });
      navigate('/ucr-filing');
      return;
    }

    const parsedData = JSON.parse(storedData);
    setUsdotData(parsedData);

    const initializeFiling = async () => {
      try {
        // Initialize form data with powerUnits from stored USDOT data
        const initialFormData = {
          ...formData,
          powerUnits: parsedData.powerUnits || 0,
          straightTrucks: parsedData.powerUnits || 0
        };
        const filing = await createFiling(parsedData.usdotNumber, 'ucr', initialFormData);
        setFilingId(filing.id);
        setFormData(initialFormData);
      } catch (error) {
        console.error('Error creating filing:', error);
        toast({
          title: "Error",
          description: "Failed to initialize filing. Please try again.",
          variant: "destructive",
        });
      }
    };

    initializeFiling();
  }, [navigate, toast, location]);

  return {
    currentStep,
    setCurrentStep,
    totalSteps: 4,
    usdotData,
    filingId,
    formData,
    setFormData,
    toast
  };
};
