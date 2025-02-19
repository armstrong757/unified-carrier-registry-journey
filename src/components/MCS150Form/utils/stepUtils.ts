
export const shouldSkipStep3 = (formData: any) => {
  return (
    formData.hasChanges !== "yes" || !formData.changesToMake?.companyInfo
  );
};

export const shouldSkipStep4 = (formData: any) => {
  return (
    formData.hasChanges !== "yes" || !formData.changesToMake?.operatingInfo
  );
};

export const getNextStep = (currentStep: number, formData: any) => {
  console.log('Getting next step. Current step:', currentStep);
  console.log('Form data:', formData);

  // Basic validation - if the current step isn't complete, don't proceed
  const isComplete = isStepComplete(currentStep, formData);
  console.log('Is step complete?', isComplete);

  if (!isComplete) {
    return currentStep;
  }

  // Special case for out of business
  if (currentStep === 1 && formData.reasonForFiling === "outOfBusiness") {
    console.log('Out of business case - skipping to step 5');
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
      return 4;
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
  console.log('Getting previous step. Current step:', currentStep);
  console.log('Form data:', formData);

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
  console.log(`Validating step ${step} with form data:`, formData);

  switch (step) {
    case 1:
      // Check if a reason for filing is selected and is a valid value
      const isValid = typeof formData.reasonForFiling === 'string' && 
        ['biennialUpdate', 'reactivate', 'reapplication', 'outOfBusiness'].includes(formData.reasonForFiling);
      console.log('Step 1 validation result:', isValid);
      return isValid;
    
    case 2:
      const hasChangesValid = formData.hasChanges === "yes" || formData.hasChanges === "no";
      console.log('Step 2 validation result:', hasChangesValid);
      return hasChangesValid;
    
    case 3:
      if (!formData.changesToMake?.companyInfo) return true;
      // Add validation for company info changes
      return true; // Implement specific validation if needed
    
    case 4:
      if (!formData.changesToMake?.operatingInfo) return true;
      // Add validation for operating info changes
      return true; // Implement specific validation if needed
    
    case 5:
      const operatorValid = formData.operator && 
        formData.operator.firstName &&
        formData.operator.lastName &&
        formData.operator.email;
      console.log('Step 5 validation result:', operatorValid);
      return operatorValid;
    
    case 6:
      const billingValid = formData.billing &&
        formData.billing.cardType &&
        formData.billing.termsAccepted;
      console.log('Step 6 validation result:', billingValid);
      return billingValid;
    
    default:
      return true;
  }
};
