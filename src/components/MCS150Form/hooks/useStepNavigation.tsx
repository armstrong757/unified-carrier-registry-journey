
import { useCallback } from "react";
import { updateFilingData, createTransaction } from "@/utils/filing";
import { getNextStep, getPreviousStep } from "../utils/stepUtils";
import { validateField } from "@/utils/formValidation";

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

      case 3:
        if (formData.hasChanges === "yes" && formData.changesToMake?.companyInfo) {
          // Validate company information changes
          if (formData.companyInfoChanges?.ownerName && !formData.ownerName?.trim()) {
            toast({
              title: "Required Field",
              description: "Please enter the owner's name.",
              variant: "destructive",
            });
            return false;
          }

          if (formData.companyInfoChanges?.einSsn) {
            if (!formData.companyIdentifierType) {
              toast({
                title: "Required Field",
                description: "Please select an identifier type (EIN or SSN).",
                variant: "destructive",
              });
              return false;
            }
            if (!formData.companyIdentifier?.trim()) {
              toast({
                title: "Required Field",
                description: "Please enter your EIN or SSN.",
                variant: "destructive",
              });
              return false;
            }
          }

          if (formData.companyInfoChanges?.address) {
            const requiredAddressFields = ['address', 'city', 'state', 'zip', 'country'];
            for (const field of requiredAddressFields) {
              if (!formData.principalAddress?.[field]?.trim()) {
                toast({
                  title: "Required Field",
                  description: `Please enter the ${field} for principal address.`,
                  variant: "destructive",
                });
                return false;
              }
              if (!formData.mailingAddress?.[field]?.trim()) {
                toast({
                  title: "Required Field",
                  description: `Please enter the ${field} for mailing address.`,
                  variant: "destructive",
                });
                return false;
              }
            }
          }

          if (formData.companyInfoChanges?.phone && !formData.businessPhone?.trim()) {
            toast({
              title: "Required Field",
              description: "Please enter the business phone number.",
              variant: "destructive",
            });
            return false;
          }

          if (formData.companyInfoChanges?.email && !formData.businessEmail?.trim()) {
            toast({
              title: "Required Field",
              description: "Please enter the business email address.",
              variant: "destructive",
            });
            return false;
          }

          if (formData.companyInfoChanges?.companyName && !formData.companyName?.trim()) {
            toast({
              title: "Required Field",
              description: "Please enter the company name.",
              variant: "destructive",
            });
            return false;
          }
        }
        return true;

      case 4:
        if (formData.hasChanges === "yes" && formData.changesToMake?.operatingInfo) {
          // Vehicle Information
          if (formData.operatingInfoChanges?.vehicles) {
            if (typeof formData.vehicles?.straightTrucks === 'undefined') {
              toast({
                title: "Required Field",
                description: "Please enter the number of straight trucks.",
                variant: "destructive",
              });
              return false;
            }
            if (typeof formData.vehicles?.tractorTrucks === 'undefined') {
              toast({
                title: "Required Field",
                description: "Please enter the number of tractor trucks.",
                variant: "destructive",
              });
              return false;
            }
          }

          // Driver Information
          if (formData.operatingInfoChanges?.drivers) {
            if (typeof formData.drivers?.totalDrivers === 'undefined') {
              toast({
                title: "Required Field",
                description: "Please enter the total number of drivers.",
                variant: "destructive",
              });
              return false;
            }
            if (typeof formData.drivers?.cdlDrivers === 'undefined') {
              toast({
                title: "Required Field",
                description: "Please enter the number of CDL drivers.",
                variant: "destructive",
              });
              return false;
            }
          }

          // Classifications
          if (formData.operatingInfoChanges?.classifications && 
              !formData.classifications?.some((c: boolean) => c)) {
            toast({
              title: "Required Field",
              description: "Please select at least one classification.",
              variant: "destructive",
            });
            return false;
          }
        }
        return true;

      case 5:
        // Operator Information
        if (!formData.operator?.firstName?.trim()) {
          toast({
            title: "Required Field",
            description: "Please enter operator's first name.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.operator?.lastName?.trim()) {
          toast({
            title: "Required Field",
            description: "Please enter operator's last name.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.operator?.title?.trim()) {
          toast({
            title: "Required Field",
            description: "Please enter operator's job title.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.operator?.einSsn?.trim()) {
          toast({
            title: "Required Field",
            description: "Please enter operator's EIN/SSN.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.operator?.phone?.trim()) {
          toast({
            title: "Required Field",
            description: "Please enter operator's phone number.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.operator?.email?.trim()) {
          toast({
            title: "Required Field",
            description: "Please enter operator's email address.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.operator?.milesDriven?.trim()) {
          toast({
            title: "Required Field",
            description: "Please enter the miles driven in the last 12 months.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.operator?.signature) {
          toast({
            title: "Required Field",
            description: "Please provide your signature.",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 6:
        if (!formData.billing?.cardNumber?.trim()) {
          toast({
            title: "Required Field",
            description: "Please enter your card number.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.billing?.expiryDate?.trim()) {
          toast({
            title: "Required Field",
            description: "Please enter your card expiry date.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.billing?.cvv?.trim()) {
          toast({
            title: "Required Field",
            description: "Please enter your card CVV.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.billing?.cardName?.trim()) {
          toast({
            title: "Required Field",
            description: "Please enter the name on your card.",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.billing?.termsAccepted) {
          toast({
            title: "Required Field",
            description: "Please accept the terms and conditions.",
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
