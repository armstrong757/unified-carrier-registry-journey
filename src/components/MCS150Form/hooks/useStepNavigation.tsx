
import { useCallback } from "react";
import { updateFilingData, createTransaction } from "@/utils/filing";
import { getNextStep, getPreviousStep } from "../utils/stepUtils";

export const useStepNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  totalSteps: number,
  filingId: string | null,
  formData: any,
  toast: any
) => {
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.reasonForFiling) {
          toast({
            title: "Required Field",
            description: "Please select a reason for filing.",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 2:
        if (!formData.hasChanges) {
          toast({
            title: "Required Field",
            description: "Please indicate whether you need to make any changes.",
            variant: "destructive",
          });
          return false;
        }
        if (formData.hasChanges === "yes" && 
            (!formData.changesToMake || !Object.values(formData.changesToMake).some(Boolean))) {
          toast({
            title: "Required Field",
            description: "Please select at least one type of change to make.",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 6:
        if (!formData.billing?.termsAccepted) {
          toast({
            title: "Required Field",
            description: "Please accept the terms and conditions to continue.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.billing?.cardNumber || 
            !formData.billing?.expiryDate || 
            !formData.billing?.cvv || 
            !formData.billing?.cardName) {
          toast({
            title: "Required Fields",
            description: "Please fill out all payment information fields.",
            variant: "destructive",
          });
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = useCallback(async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < totalSteps) {
      try {
        console.log('Current step:', currentStep);
        console.log('Form data for current step:', formData);
        
        const nextStep = getNextStep(currentStep, formData);
        console.log('Calculated next step:', nextStep);
        
        if (nextStep === currentStep) {
          toast({
            title: "Action Required",
            description: "Please complete all required fields before proceeding.",
            variant: "destructive",
          });
          return;
        }

        if (filingId) {
          console.log('Updating filing data for step:', nextStep);
          const updatedFiling = await updateFilingData(filingId, formData, nextStep);
          if (!updatedFiling) {
            throw new Error('Failed to update filing data');
          }
          console.log('Filing data updated successfully');
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
          await createTransaction(filingId, 149, formData.billing?.cardType);
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
        console.log('Calculating previous step from:', currentStep);
        const previousStep = getPreviousStep(currentStep, formData);
        console.log('Calculated previous step:', previousStep);
        
        if (filingId) {
          console.log('Updating filing data for previous step');
          const updatedFiling = await updateFilingData(filingId, formData, previousStep);
          if (!updatedFiling) {
            throw new Error('Failed to update filing data');
          }
          console.log('Filing data updated successfully');
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
