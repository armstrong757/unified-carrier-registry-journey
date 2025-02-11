
import { Progress } from "@/components/ui/progress";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

const FormProgress = ({ currentStep, totalSteps }: FormProgressProps) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8 space-y-2">
      <Progress value={progressPercentage} className="h-2" />
      <div className="text-sm text-center text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};

export default FormProgress;
