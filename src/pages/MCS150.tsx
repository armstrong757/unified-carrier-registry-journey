
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import FormProgress from "@/components/UCRForm/FormProgress";
import StepOne from "@/components/MCS150Form/StepOne";
import StepTwo from "@/components/MCS150Form/StepTwo";
import StepThree from "@/components/MCS150Form/StepThree";
import StepFour from "@/components/MCS150Form/StepFour";
import StepFive from "@/components/MCS150Form/StepFive";
import StepSix from "@/components/MCS150Form/StepSix";

const MCS150 = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    // Step 1 - Reason for Filing
    reasonForFiling: {
      biennialUpdate: false,
      reactivate: false,
      reapplication: false,
      outOfBusiness: false,
    },

    // Step 2 - Changes
    hasChanges: "",
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

    // Step 3 - Company Information
    ownerName: "",
    principalAddress: {
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    mailingAddress: {
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    businessPhone: "",
    businessEmail: "",
    companyName: "",
    einSsn: "",

    // Step 4 - Operations
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
      interstate: "",
      intrastate: "",
      total: "",
      cdl: "",
    },
    hazmatDetails: {},

    // Step 5 - Operator
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
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
    </div>
  );
};

export default MCS150;
