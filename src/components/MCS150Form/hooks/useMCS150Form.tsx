import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { createFiling, updateFilingData, createTransaction } from "@/utils/filingUtils";

export const useMCS150Form = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [usdotData, setUsdotData] = useState<any>(null);
  const [filingId, setFilingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    reasonForFiling: {
      biennialUpdate: true,
      reactivate: false,
      reapplication: false,
      outOfBusiness: false,
    },
    hasChanges: "no",
    changesToMake: {
      companyInfo: false,
      operatingInfo: false,
      other: false,
    },
    companyInfoChanges: {
      ownerName: false,
      address: false,
      phone: false,
      email: false,
      companyName: false,
      einSsn: false,
    },
    operatingInfoChanges: {
      vehicles: false,
      drivers: false,
      operations: false,
      classifications: false,
      cargo: false,
      hazmat: false,
    },
    ownerName: "",
    principalAddress: {
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "USA",
    },
    mailingAddress: {
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "USA",
    },
    businessPhone: "",
    businessEmail: "",
    companyName: "",
    einSsn: "",
    companyOperations: {
      interstateCarrier: false,
      intrastatehazmatCarrier: false,
      intrastateNonHazmatCarrier: false,
      intrastateHazmatShipper: false,
      intrastateNonHazmatShipper: false,
    },
    operationsClassifications: {},
    cargoClassifications: {},
    vehicles: {
      straightTrucks: { owned: 0, termLeased: 0, tripLeased: 0 },
      truckTractors: { owned: 0, termLeased: 0, tripLeased: 0 },
      trailers: { owned: 0, termLeased: 0, tripLeased: 0 },
      hazmatTrucks: { owned: 0, termLeased: 0, tripLeased: 0 },
      hazmatTrailers: { owned: 0, termLeased: 0, tripLeased: 0 },
      motorCoach: { owned: 0, termLeased: 0, tripLeased: 0 },
      schoolBusSmall: { owned: 0, termLeased: 0, tripLeased: 0 },
      schoolBusMedium: { owned: 0, termLeased: 0, tripLeased: 0 },
      schoolBusLarge: { owned: 0, termLeased: 0, tripLeased: 0 },
      busLarge: { owned: 0, termLeased: 0, tripLeased: 0 },
      vanSmall: { owned: 0, termLeased: 0, tripLeased: 0 },
      vanMedium: { owned: 0, termLeased: 0, tripLeased: 0 },
      limousineSmall: { owned: 0, termLeased: 0, tripLeased: 0 },
      limousineMedium: { owned: 0, termLeased: 0, tripLeased: 0 },
    },
    drivers: {
      interstate: "0",
      intrastate: "0",
      total: "0",
      cdl: "0",
    },
    hazmatDetails: {},
    operator: {
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      phone: "",
      einSsn: "",
      milesDriven: "",
      licenseFile: null,
      signature: "",
    },
    billing: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
      cardType: "credit",
      termsAccepted: false,
    },
  });

  useEffect(() => {
    const stateData = location.state?.usdotData;
    const resumedFiling = location.state?.resumedFiling;
    
    if (stateData) {
      setUsdotData(stateData);
      
      const initializeFiling = async () => {
        try {
          if (resumedFiling) {
            setFilingId(resumedFiling.id);
            setFormData(resumedFiling.form_data);
            setCurrentStep(resumedFiling.last_step_completed || 1);
          } else {
            const filing = await createFiling(stateData.usdotNumber, 'mcs150', formData);
            if (filing) {
              setFilingId(filing.id);
            } else {
              throw new Error('Failed to create filing');
            }
          }
        } catch (error) {
          console.error('Error initializing filing:', error);
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

    if (!location.state?.usdotData) {
      const storedData = sessionStorage.getItem('usdotData');
      if (!storedData) {
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
        setUsdotData(parsedData);
        const initializeFiling = async () => {
          try {
            const filing = await createFiling(parsedData.usdotNumber, 'mcs150', formData);
            if (filing) {
              setFilingId(filing.id);
            } else {
              throw new Error('Failed to create filing');
            }
          } catch (error) {
            console.error('Error creating filing:', error);
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
    }
  }, [navigate, toast, location]);

  return {
    currentStep,
    setCurrentStep,
    totalSteps,
    usdotData,
    filingId,
    formData,
    setFormData,
    toast
  };
};
