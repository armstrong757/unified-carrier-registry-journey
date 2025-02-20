
import { createTransaction, updateFilingData } from "@/utils/filing";
import { toast as toastFunction } from "@/hooks/use-toast";

type ToastFunction = typeof toastFunction;

export const useStepNavigation = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  totalSteps: number,
  filingId: string | null,
  formData: any,
  toast: {
    toast: ToastFunction;
  }
) => {
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.authorization) {
          toast.toast({
            title: "Required Field",
            description: "Please certify that you are authorized to submit this registration.",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 2:
        if (!formData.classifications || !Object.values(formData.classifications).some(Boolean)) {
          toast.toast({
            title: "Required Field",
            description: "Please select at least one classification.",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 4:
        if (!formData.termsAccepted) {
          toast.toast({
            title: "Required Field",
            description: "Please accept the terms and conditions to continue.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) {
          toast.toast({
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

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < totalSteps) {
      try {
        if (filingId) {
          await updateFilingData(filingId, formData, currentStep + 1);
        }
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error('Error updating filing:', error);
        toast.toast({
          title: "Error",
          description: "Failed to save form data. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      try {
        if (filingId) {
          const transaction = await createTransaction(filingId, 149, formData.cardType);
          if (transaction) {
            toast.toast({
              title: "Success",
              description: "Your UCR registration has been submitted successfully.",
            });
          }
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        toast.toast({
          title: "Error",
          description: "Failed to process payment. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBack = async () => {
    if (currentStep > 1) {
      try {
        if (filingId) {
          await updateFilingData(filingId, formData, currentStep - 1);
        }
        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error('Error updating step:', error);
      }
    }
  };

  return { handleNext, handleBack };
};
