
import { Button } from "@/components/ui/button";
import FormProgress from "@/components/UCRForm/FormProgress";
import StepOne from "@/components/MCS150Form/StepOne";
import StepTwo from "@/components/MCS150Form/StepTwo";
import StepThree from "@/components/MCS150Form/StepThree";
import StepFour from "@/components/MCS150Form/StepFour";
import StepFive from "@/components/MCS150Form/StepFive";
import StepSix from "@/components/MCS150Form/StepSix";
import USDOTSummary from "@/components/UCRForm/USDOTSummary";
import ProgressSavedIndicator from "@/components/UCRForm/ProgressSavedIndicator";
import { useMCS150Form } from "@/components/MCS150Form/hooks/useMCS150Form";
import { useStepNavigation } from "@/components/MCS150Form/hooks/useStepNavigation";

const MCS150 = () => {
  const {
    currentStep,
    setCurrentStep,
    totalSteps,
    usdotData,
    filingId,
    formData,
    setFormData,
    toast
  } = useMCS150Form();

  const { handleNext, handleBack } = useStepNavigation(
    currentStep,
    setCurrentStep,
    totalSteps,
    filingId,
    formData,
    toast
  );

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
    return null;
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
              <ProgressSavedIndicator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCS150;
