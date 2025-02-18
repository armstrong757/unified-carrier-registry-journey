
import { uploadFormAttachment } from "../fileUtils";

export const sanitizeAndProcessFormData = async (formData: any, usdotNumber: string) => {
  const {
    cardNumber,
    expiryDate,
    cvv,
    cardName,
    ...sanitizedData
  } = formData;

  // Handle file attachments if present
  const attachments: Record<string, string> = {};
  const fileData: Record<string, any> = {};
  
  if (sanitizedData.operator?.signature) {
    try {
      const signatureFile = await fetch(sanitizedData.operator.signature)
        .then(res => res.blob())
        .then(blob => new File([blob], 'signature.png', { type: 'image/png' }));
      
      const { fileName, publicUrl, base64Data, contentType } = 
        await uploadFormAttachment(signatureFile, usdotNumber, 'signature');
      
      attachments.signature = publicUrl;
      fileData.signatureFile = base64Data;
      fileData.signatureContentType = contentType;
      sanitizedData.operator.signature = publicUrl;
    } catch (error) {
      console.error('Error processing signature:', error);
    }
  }

  if (sanitizedData.operator?.licenseFile instanceof File) {
    try {
      const { fileName, publicUrl, base64Data, contentType, originalName } = 
        await uploadFormAttachment(sanitizedData.operator.licenseFile, usdotNumber, 'license');
      
      attachments.license = publicUrl;
      fileData.licenseFile = base64Data;
      fileData.licenseContentType = contentType;
      fileData.licenseFileName = originalName;
      sanitizedData.operator.licenseFile = publicUrl;
    } catch (error) {
      console.error('Error processing license file:', error);
    }
  }

  return {
    formData: sanitizedData,
    flatFormData: flattenFormData(sanitizedData),
    attachments,
    fileData
  };
};

// Helper to flatten nested objects for Airtable compatibility
export const flattenFormData = (data: any, parentKey = ''): Record<string, any> => {
  return Object.keys(data).reduce((acc, key) => {
    const newKey = parentKey ? `${parentKey}_${key}` : key;
    
    if (
      typeof data[key] === 'object' && 
      data[key] !== null && 
      !(data[key] instanceof File) &&
      !(data[key] instanceof Blob) &&
      !Array.isArray(data[key])
    ) {
      Object.assign(acc, flattenFormData(data[key], newKey));
    } else {
      acc[newKey] = data[key];
    }
    
    return acc;
  }, {} as Record<string, any>);
};
