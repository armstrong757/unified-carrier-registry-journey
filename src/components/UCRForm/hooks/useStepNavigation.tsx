
import { createTransaction, updateFilingData } from "@/utils/filing";
import { toast as toastFunction } from "@/hooks/use-toast";
import { validateField } from "@/utils/formValidation";

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
        // Check all required fields for step 1
        if (!formData.representative?.trim()) {
          toast.toast({
            title: "Required Field",
            description: "Please enter your full name.",
            variant: "destructive",
          });
          return false;
        }
        
        if (!formData.email?.trim()) {
          toast.toast({
            title: "Required Field",
            description: "Please enter your email address.",
            variant: "destructive",
          });
          return false;
        }

        if (!formData.phone?.trim()) {
          toast.toast({
            title: "Required Field",
            description: "Please enter your phone number.",
            variant: "destructive",
          });
          return false;
        }

        // Validate email format
        const emailValidation = validateField('email', formData.email);
        if (!emailValidation.valid) {
          toast.toast({
            title: "Invalid Email",
            description: emailValidation.error,
            variant: "destructive",
          });
          return false;
        }

        // Validate phone format
        const phoneValidation = validateField('phone', formData.phone);
        if (!phoneValidation.valid) {
          toast.toast({
            title: "Invalid Phone Number",
            description: phoneValidation.error,
            variant: "destructive",
          });
          return false;
        }

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

      case 3:
        // Validate vehicle counts
        if (typeof formData.straightTrucks === 'undefined' || formData.straightTrucks === '') {
          toast.toast({
            title: "Required Field",
            description: "Please enter the number of straight trucks.",
            variant: "destructive",
          });
          return false;
        }

        if (typeof formData.powerUnits === 'undefined' || formData.powerUnits === '') {
          toast.toast({
            title: "Required Field",
            description: "Please enter the number of power units.",
            variant: "destructive",
          });
          return false;
        }

        if (formData.needsVehicleChanges === "yes") {
          if (typeof formData.addVehicles === 'undefined' || formData.addVehicles === '') {
            toast.toast({
              title: "Required Field",
              description: "Please enter the number of vehicles to add.",
              variant: "destructive",
            });
            return false;
          }

          if (typeof formData.excludeVehicles === 'undefined' || formData.excludeVehicles === '') {
            toast.toast({
              title: "Required Field",
              description: "Please enter the number of vehicles to exclude.",
              variant: "destructive",
            });
            return false;
          }
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

        // Validate card details
        const cardValidation = validateField('cardNumber', formData.cardNumber);
        if (!cardValidation.valid) {
          toast.toast({
            title: "Invalid Card Number",
            description: cardValidation.error,
            variant: "destructive",
          });
          return false;
        }

        const expiryValidation = validateField('expiryDate', formData.expiryDate);
        if (!expiryValidation.valid) {
          toast.toast({
            title: "Invalid Expiry Date",
            description: expiryValidation.error,
            variant: "destructive",
          });
          return false;
        }

        const cvvValidation = validateField('cvv', formData.cvv);
        if (!cvvValidation.valid) {
          toast.toast({
            title: "Invalid CVV",
            description: cvvValidation.error,
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
