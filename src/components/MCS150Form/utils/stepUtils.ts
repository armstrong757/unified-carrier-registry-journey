
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
  if (currentStep === 1 && formData.reasonForFiling.outOfBusiness) {
    return 5;
  }
  if (currentStep === 2) {
    if (shouldSkipStep3(formData) && shouldSkipStep4(formData)) return 5;
    if (shouldSkipStep3(formData)) return 4;
    return 3;
  }
  if (currentStep === 3 && shouldSkipStep4(formData)) {
    return 5;
  }
  return currentStep + 1;
};

export const getPreviousStep = (currentStep: number, formData: any) => {
  if (currentStep === 5) {
    if (formData.reasonForFiling.outOfBusiness) return 1;
    if (shouldSkipStep3(formData) && shouldSkipStep4(formData)) return 2;
    if (shouldSkipStep4(formData)) return 3;
    return 4;
  }
  if (currentStep === 4 && shouldSkipStep3(formData)) {
    return 2;
  }
  return currentStep - 1;
};
