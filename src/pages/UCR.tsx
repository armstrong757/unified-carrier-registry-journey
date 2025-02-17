
import { UCRFormContainer } from "@/components/UCRForm/UCRFormContainer";
import USDOTSummary from "@/components/UCRForm/USDOTSummary";
import ProgressSavedIndicator from "@/components/UCRForm/ProgressSavedIndicator";
import { useUCRForm } from "@/components/UCRForm/hooks/useUCRForm";
import { useStepNavigation } from "@/components/UCRForm/hooks/useStepNavigation";
import { useToast } from "@/hooks/use-toast";

const UCR = () => {
  const {
    currentStep,
    setCurrentStep,
    totalSteps,
    usdotData,
    filingId,
    formData,
    setFormData
  } = useUCRForm();

  const { toast } = useToast();

  const { handleNext, handleBack } = useStepNavigation(
    currentStep,
    setCurrentStep,
    totalSteps,
    filingId,
    formData,
    { toast }
  );

  if (!usdotData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto ucr-form-container mb-[250px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <UCRFormContainer
              currentStep={currentStep}
              totalSteps={totalSteps}
              formData={formData}
              setFormData={setFormData}
              handleBack={handleBack}
              handleNext={handleNext}
            />
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

export default UCR;
