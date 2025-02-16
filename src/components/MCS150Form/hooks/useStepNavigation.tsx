
import { useCallback } from "react";
import { updateFilingData, createTransaction } from "@/utils/filingUtils";
import { getNextStep } from "../utils/stepUtils";

export const useStepNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  totalSteps: number,
  filingId: string | null,
  formData: any,
  toast: any
) => {
  const handleNext = useCallback(async () => {
    if (currentStep < totalSteps) {
      try {
        if (filingId) {
          const nextStep = getNextStep(currentStep, formData);
          await updateFilingData(filingId, formData, nextStep);
        }
        setCurrentStep(getNextStep(currentStep, formData));
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
  }, [currentStep, totalSteps, filingId, formData, setCurrentStep, toast]);

  const handleBack = useCallback(async () => {
    if (currentStep > 1) {
      try {
        if (filingId) {
          const previousStep = currentStep - 1;
          await updateFilingData(filingId, formData, previousStep);
        }
        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error('Error updating step:', error);
      }
    }
  }, [currentStep, filingId, formData, setCurrentStep]);

  return { handleNext, handleBack };
};
