
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useFormState } from "./useFormState";
import { useFilingInitialization } from "./useFilingInitialization";

export const useMCS150Form = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  const { formData, setFormData } = useFormState();
  const { usdotData, filingId, isInitialized } = useFilingInitialization(formData);

  return {
    currentStep,
    setCurrentStep,
    totalSteps,
    usdotData,
    filingId,
    formData,
    setFormData,
    toast
  };
};
