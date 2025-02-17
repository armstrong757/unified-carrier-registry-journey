
import { Button } from "@/components/ui/button";
import FormProgress from "@/components/UCRForm/FormProgress";
import StepOne from "@/components/UCRForm/StepOne";
import StepTwo from "@/components/UCRForm/StepTwo";
import StepThree from "@/components/UCRForm/StepThree";
import StepFour from "@/components/UCRForm/StepFour";

interface UCRFormContainerProps {
  currentStep: number;
  totalSteps: number;
  formData: any;
  setFormData: (data: any) => void;
  handleBack: () => void;
  handleNext: () => void;
}

export const UCRFormContainer = ({
  currentStep,
  totalSteps,
  formData,
  setFormData,
  handleBack,
  handleNext
}: UCRFormContainerProps) => {
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

  return (
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
  );
};
