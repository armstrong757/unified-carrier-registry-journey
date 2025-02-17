
import { useCallback } from "react";
import { updateFilingData, createTransaction } from "@/utils/filingUtils";
import { getNextStep, getPreviousStep } from "../utils/stepUtils";

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
        const nextStep = getNextStep(currentStep, formData);
        if (nextStep === currentStep) {
          // If step didn't change, show a message to user
          toast({
            title: "Action Required",
            description: "Please complete all required fields before proceeding.",
            variant: "destructive",
          });
          return;
        }

        if (filingId) {
          const updatedFiling = await updateFilingData(filingId, formData, nextStep);
          if (!updatedFiling) {
            throw new Error('Failed to update filing data');
          }
        }

        setCurrentStep(nextStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error('Error updating filing:', error);
        toast({
          title: "Error",
          description: error instanceof Error 
            ? error.message 
            : "Failed to save form data. Please try again.",
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
        const previousStep = getPreviousStep(currentStep, formData);
        
        if (filingId) {
          const updatedFiling = await updateFilingData(filingId, formData, previousStep);
          if (!updatedFiling) {
            throw new Error('Failed to update filing data');
          }
        }

        setCurrentStep(previousStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error('Error updating step:', error);
        toast({
          title: "Error",
          description: error instanceof Error 
            ? error.message 
            : "Failed to save form data. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [currentStep, filingId, formData, setCurrentStep, toast]);

  return { handleNext, handleBack };
};
