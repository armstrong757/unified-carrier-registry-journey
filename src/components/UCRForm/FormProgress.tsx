
import { Progress } from "@/components/ui/progress";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

const FormProgress = ({ currentStep, totalSteps }: FormProgressProps) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8">
      <Progress
        value={progressPercentage}
        className="h-2 border border-[#1EAEDB] bg-white"
      />
    </div>
  );
};

export default FormProgress;
