
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import FormProgress from "@/components/UCRForm/FormProgress";
import StepOne from "@/components/MCS150Form/StepOne";
import StepTwo from "@/components/MCS150Form/StepTwo";
import StepThree from "@/components/MCS150Form/StepThree";
import StepFour from "@/components/MCS150Form/StepFour";
import StepFive from "@/components/MCS150Form/StepFive";
import StepSix from "@/components/MCS150Form/StepSix";
import USDOTSummary from "@/components/UCRForm/USDOTSummary";
import { createFiling, updateFilingData, createTransaction } from "@/utils/filingUtils";

const MCS150 = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [usdotData, setUsdotData] = useState<any>(null);
  const [filingId, setFilingId] = useState<string | null>(null);

  useEffect(() => {
    const stateData = location.state?.usdotData;
    const resumedFiling = location.state?.resumedFiling;
    
    if (stateData) {
      setUsdotData(stateData);
      
      const initializeFiling = async () => {
        try {
          if (resumedFiling) {
            // If resuming, use the existing filing
            setFilingId(resumedFiling.id);
            setFormData(resumedFiling.form_data);
          } else {
            // Create new filing
            const filing = await createFiling(stateData.usdotNumber, 'mcs150', formData);
            setFilingId(filing.id);
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
        description: "No DOT information found. Please start from the MCS-150 Filing page.",
        variant: "destructive",
      });
      navigate('/mcs-150-filing');
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setUsdotData(parsedData);
      const initializeFiling = async () => {
        try {
          const filing = await createFiling(parsedData.usdotNumber, 'mcs150', formData);
          setFilingId(filing.id);
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
    } catch (error) {
      console.error('Error parsing stored USDOT data:', error);
      toast({
        title: "Error",
        description: "Invalid DOT information. Please try again.",
        variant: "destructive",
      });
      navigate('/mcs-150-filing');
    }
  }, [navigate, toast, location]);

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
      cardType: "credit", // This is now properly nested under billing
      termsAccepted: false,
    },
  });

  useEffect(() => {
    if (usdotData) {
      console.log('Updating form data with USDOT data:', usdotData);
      
      let street = '', city = '', state = '', zip = '';
      if (usdotData.physicalAddress) {
        const addressParts = usdotData.physicalAddress.split(',').map((part: string) => part.trim());
        if (addressParts.length >= 3) {
          street = addressParts[0] || '';
          city = addressParts[1] || '';
          const stateZipParts = addressParts[2].split(' ');
          state = stateZipParts[0] || '';
          zip = stateZipParts[1] || '';
        }
      }

      setFormData(prev => ({
        ...prev,
        principalAddress: {
          address: street || '',
          city: city || '',
          state: state || '',
          zip: zip || '',
          country: "USA",
        },
        mailingAddress: {
          address: street || '',
          city: city || '',
          state: state || '',
          zip: zip || '',
          country: "USA",
        },
        businessPhone: usdotData.telephone || '',
        companyName: usdotData.legalName || '',
        vehicles: {
          ...prev.vehicles,
          motorCoach: { 
            ...prev.vehicles.motorCoach,
            owned: usdotData.motorcoachCount || 0 
          },
          busLarge: { 
            ...prev.vehicles.busLarge,
            owned: usdotData.busCount || 0 
          },
          vanSmall: { 
            ...prev.vehicles.vanSmall,
            owned: usdotData.vanCount || 0 
          },
          limousineSmall: { 
            ...prev.vehicles.limousineSmall,
            owned: usdotData.limoCount || 0 
          },
        },
        drivers: {
          ...prev.drivers,
          total: (usdotData.powerUnits || 0).toString(),
          cdl: (usdotData.powerUnits || 0).toString(),
          interstate: "0",
          intrastate: "0",
        },
      }));
    }
  }, [usdotData]);

  const shouldSkipStep3 = () => {
    return (
      formData.hasChanges !== "yes" || !formData.changesToMake.companyInfo
    );
  };

  const shouldSkipStep4 = () => {
    return (
      formData.hasChanges !== "yes" || !formData.changesToMake.operatingInfo
    );
  };

  const getNextStep = (currentStep: number) => {
    if (currentStep === 1 && formData.reasonForFiling.outOfBusiness) {
      return 5;
    }
    if (currentStep === 2) {
      if (shouldSkipStep3() && shouldSkipStep4()) return 5;
      if (shouldSkipStep3()) return 4;
      return 3;
    }
    if (currentStep === 3 && shouldSkipStep4()) {
      return 5;
    }
    return currentStep + 1;
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      try {
        if (filingId) {
          await updateFilingData(filingId, formData);
        }
        setCurrentStep(getNextStep(currentStep));
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error('Error updating filing:', error);
        toast({
          title: "Error",
          description: "Failed to save form data. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      try {
        if (filingId) {
          await createTransaction(filingId, 149, formData.billing.cardType);
          toast({
            title: "Success",
            description: "Your MCS-150 form has been submitted successfully.",
          });
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        toast({
          title: "Error",
          description: "Failed to process payment. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      if (formData.reasonForFiling.outOfBusiness && currentStep === 5) {
        setCurrentStep(1);
      } else if (currentStep === 5) {
        if (!shouldSkipStep4()) setCurrentStep(4);
        else if (!shouldSkipStep3()) setCurrentStep(3);
        else setCurrentStep(2);
      } else if (currentStep === 4 && shouldSkipStep3()) {
        setCurrentStep(2);
      } else {
        setCurrentStep(currentStep - 1);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne formData={formData} setFormData={setFormData} />;
      case 2:
        return <StepTwo formData={formData} setFormData={setFormData} />;
      case 3:
        return <StepThree formData={formData} setFormData={setFormData} />;
      case 4:
        return <StepFour formData={formData} setFormData={setFormData} />;
      case 5:
        return <StepFive formData={formData} setFormData={setFormData} />;
      case 6:
        return <StepSix formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  if (!usdotData) {
    return null; // Don't render anything while loading
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mcs-form-container mb-[250px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">
                MCS-150 Biennial Update
              </h1>

              <FormProgress currentStep={currentStep} totalSteps={totalSteps} />

              {renderStep()}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>
                <Button onClick={handleNext}>
                  {currentStep === totalSteps ? "Submit" : "Next"}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <USDOTSummary data={usdotData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCS150;
