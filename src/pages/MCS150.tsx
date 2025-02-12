import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import FormProgress from "@/components/UCRForm/FormProgress";
import StepOne from "@/components/MCS150Form/StepOne";
import StepTwo from "@/components/MCS150Form/StepTwo";
import StepThree from "@/components/MCS150Form/StepThree";
import StepFour from "@/components/MCS150Form/StepFour";
import StepFive from "@/components/MCS150Form/StepFive";
import StepSix from "@/components/MCS150Form/StepSix";
import USDOTSummary from "@/components/UCRForm/USDOTSummary";

const MCS150 = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [usdotData, setUsdotData] = useState<any>(null);

  useEffect(() => {
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
    setUsdotData(JSON.parse(storedData));
  }, [navigate, toast]);

  const [formData, setFormData] = useState({
    // Step 1 - Reason for Filing
    reasonForFiling: {
      biennialUpdate: true,
      reactivate: false,
      reapplication: false,
      outOfBusiness: false,
    },

    // Step 2 - Changes
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

    // Step 3 - Company Information (Pre-filled from USDOT data)
    ownerName: "",
    principalAddress: {
      address: usdotData?.physicalAddress?.split(',')[0]?.trim() || "",
      city: usdotData?.physicalAddress?.split(',')[1]?.trim() || "",
      state: usdotData?.physicalAddress?.split(',')[2]?.trim()?.split(' ')[0] || "",
      zip: usdotData?.physicalAddress?.split(',')[2]?.trim()?.split(' ')[1] || "",
      country: "USA",
    },
    mailingAddress: {
      address: usdotData?.physicalAddress?.split(',')[0]?.trim() || "",
      city: usdotData?.physicalAddress?.split(',')[1]?.trim() || "",
      state: usdotData?.physicalAddress?.split(',')[2]?.trim()?.split(' ')[0] || "",
      zip: usdotData?.physicalAddress?.split(',')[2]?.trim()?.split(' ')[1] || "",
      country: "USA",
    },
    businessPhone: usdotData?.telephone || "",
    businessEmail: "",
    companyName: usdotData?.legalName || "",
    einSsn: "",

    // Step 4 - Operations (Pre-filled from USDOT data)
    companyOperations: {
      interstateCarrier: usdotData?.entityType === "CARRIER",
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
      motorCoach: { owned: usdotData?.motorcoachCount || 0, termLeased: 0, tripLeased: 0 },
      schoolBusSmall: { owned: 0, termLeased: 0, tripLeased: 0 },
      schoolBusMedium: { owned: 0, termLeased: 0, tripLeased: 0 },
      schoolBusLarge: { owned: usdotData?.busCount || 0, termLeased: 0, tripLeased: 0 },
      busLarge: { owned: 0, termLeased: 0, tripLeased: 0 },
      vanSmall: { owned: usdotData?.vanCount || 0, termLeased: 0, tripLeased: 0 },
      vanMedium: { owned: 0, termLeased: 0, tripLeased: 0 },
      limousineSmall: { owned: usdotData?.limoCount || 0, termLeased: 0, tripLeased: 0 },
      limousineMedium: { owned: 0, termLeased: 0, tripLeased: 0 },
    },
    drivers: {
      interstate: "0",
      intrastate: "0",
      total: (usdotData?.powerUnits || 0).toString(),
      cdl: "0",
    },
    hazmatDetails: {},

    // Step 5 - Operator
    operator: {
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      phone: usdotData?.telephone || "",
      einSsn: "",
      milesDriven: "",
      licenseFile: null,
      signature: "",
    },

    // Step 6 - Billing
    billing: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
      termsAccepted: false,
    },
  });

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

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(getNextStep(currentStep));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast({
        title: "Form Submitted",
        description: "Your MCS-150 form has been submitted successfully.",
      });
      console.log("Form submitted:", formData);
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
      <div className="max-w-7xl mx-auto">
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
