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
import { createFiling, updateFilingData, createTransaction } from "@/utils/filingUtils";

const UCR = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [usdotData, setUsdotData] = useState<any>(null);
  const [filingId, setFilingId] = useState<string | null>(null);

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

    const parsedData = JSON.parse(storedData);
    setUsdotData(parsedData);

    // Create initial filing record
    const initializeFiling = async () => {
      try {
        const filing = await createFiling(parsedData.usdotNumber, 'ucr', formData);
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
  }, [navigate, toast]);

  const [formData, setFormData] = useState({
    // Step 1 - Representative Information (Pre-filled from USDOT data)
    registrationYear: new Date().getFullYear() + 1, // Default to next year
    representative: usdotData?.legalName || "",
    email: "",
    phone: usdotData?.telephone || "",
    authorization: false,

    // Step 2 - Classifications (Pre-filled based on entity type)
    classifications: {
      motorCarrier: usdotData?.entityType === "CARRIER",
      motorPrivate: false,
      freightForwarder: false,
      broker: false,
      leasingCompany: false,
    },

    // Step 3 - Vehicles (Pre-filled from USDOT data)
    straightTrucks: usdotData?.powerUnits || 0,
    passengerVehicles: (usdotData?.busCount || 0) + 
                      (usdotData?.limoCount || 0) + 
                      (usdotData?.minibusCount || 0) + 
                      (usdotData?.motorcoachCount || 0) + 
                      (usdotData?.vanCount || 0),
    needsVehicleChanges: "no",
    addVehicles: "",
    excludeVehicles: "",

    // Step 4 - Billing
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: usdotData?.legalName || "", // Pre-fill with company name
    termsAccepted: false,
  });

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      try {
        if (filingId) {
          await updateFilingData(filingId, formData);
        }
        setCurrentStep(currentStep + 1);
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
      // Handle form submission
      try {
        if (filingId) {
          await createTransaction(filingId, 149, formData.billing.cardType);
          toast({
            title: "Success",
            description: "Your UCR registration has been submitted successfully.",
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
      <div className="max-w-7xl mx-auto ucr-form-container mb-[250px]">
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
