
export const shouldSkipStep3 = (formData: any) => {
  return (
    formData.hasChanges !== "yes" || !formData.changesToMake.companyInfo
  );
};

export const shouldSkipStep4 = (formData: any) => {
  return (
    formData.hasChanges !== "yes" || !formData.changesToMake.operatingInfo
  );
};

export const getNextStep = (currentStep: number, formData: any) => {
  // Basic validation - if the current step isn't complete, don't proceed
  if (!isStepComplete(currentStep, formData)) {
    return currentStep;
  }

  // Special case for out of business
  if (currentStep === 1 && formData.reasonForFiling === "outOfBusiness") {
    return 5;
  }

  // Handle skipping steps based on form data
  if (currentStep === 2) {
    // If both steps should be skipped, go to step 5
    if (shouldSkipStep3(formData) && shouldSkipStep4(formData)) {
      return 5;
    }
    // If only step 3 should be skipped, go to step 4
    if (shouldSkipStep3(formData)) {
      return 3; // Return 3 to maintain sequential progression
    }
    return 3;
  }

  if (currentStep === 3) {
    if (shouldSkipStep4(formData)) {
      return 5;
    }
    return 4;
  }

  // For all other cases, move to the next step
  return Math.min(currentStep + 1, 6);
};

export const getPreviousStep = (currentStep: number, formData: any) => {
  if (currentStep === 5) {
    if (formData.reasonForFiling === "outOfBusiness") return 1;
    if (shouldSkipStep3(formData) && shouldSkipStep4(formData)) return 2;
    if (shouldSkipStep4(formData)) return 3;
    return 4;
  }

  if (currentStep === 4 && shouldSkipStep3(formData)) {
    return 2;
  }

  return Math.max(currentStep - 1, 1); // Never go below step 1
};

// Helper function to validate step completion
const isStepComplete = (step: number, formData: any): boolean => {
  switch (step) {
    case 1:
      // Check if a reason for filing is selected
      return formData.reasonForFiling != null && formData.reasonForFiling !== "";
    
    case 2:
      return formData.hasChanges === "yes" || formData.hasChanges === "no";
    
    case 3:
      if (!formData.changesToMake?.companyInfo) return true;
      // Add validation for company info changes
      return true; // Implement specific validation if needed
    
    case 4:
      if (!formData.changesToMake?.operatingInfo) return true;
      // Add validation for operating info changes
      return true; // Implement specific validation if needed
    
    case 5:
      return formData.operator && 
        formData.operator.firstName &&
        formData.operator.lastName &&
        formData.operator.email;
    
    case 6:
      return formData.billing &&
        formData.billing.cardType &&
        formData.billing.termsAccepted;
    
    default:
      return true;
  }
};
