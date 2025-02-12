
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FormProgress from "@/components/UCRForm/FormProgress";
import StepOne from "@/components/UCRForm/StepOne";
import StepTwo from "@/components/UCRForm/StepTwo";
import StepThree from "@/components/UCRForm/StepThree";
import StepFour from "@/components/UCRForm/StepFour";
import USDOTSummary from "@/components/UCRForm/USDOTSummary";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const UCR = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [usdotData, setUsdotData] = useState<any>(null);

  useEffect(() => {
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
    setUsdotData(JSON.parse(storedData));
  }, [navigate, toast]);

  const [formData, setFormData] = useState({
    // Step 1
    registrationYear: "",
    representative: "",
    email: "",
    phone: "",
    authorization: false,

    // Step 2
    classifications: {},

    // Step 3
    straightTrucks: usdotData?.powerUnits || 0,
    passengerVehicles: 0,
    needsVehicleChanges: "no",
    addVehicles: "",
    excludeVehicles: "",

    // Step 4
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    termsAccepted: false,
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Handle form submission
      toast({
        title: "Registration Submitted",
        description: "Your UCR registration has been submitted successfully.",
      });
      console.log("Form submitted:", formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
                UCR Registration
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

export default UCR;
