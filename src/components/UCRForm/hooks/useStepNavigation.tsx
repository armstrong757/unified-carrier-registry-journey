
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
  const handleNext = async () => {
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
      // Only attempt transaction if we have payment info
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) {
        toast.toast({
          title: "Missing Payment Information",
          description: "Please fill out all payment fields before submitting.",
          variant: "destructive",
        });
        return;
      }

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
