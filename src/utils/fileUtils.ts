
import { supabase } from "@/integrations/supabase/client";

export const uploadFormAttachment = async (file: File, usdotNumber: string, type: 'signature' | 'license') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${usdotNumber}/${type}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('form_attachments')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('form_attachments')
      .getPublicUrl(fileName);

    return { fileName, publicUrl };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Helper to flatten nested objects for Airtable compatibility
export const flattenFormData = (data: any, parentKey = ''): Record<string, any> => {
  return Object.keys(data).reduce((acc, key) => {
    const newKey = parentKey ? `${parentKey}_${key}` : key;
    
    if (
      typeof data[key] === 'object' && 
      data[key] !== null && 
      !(data[key] instanceof File) &&
      !Array.isArray(data[key])
    ) {
      Object.assign(acc, flattenFormData(data[key], newKey));
    } else {
      acc[newKey] = data[key];
    }
    
    return acc;
  }, {} as Record<string, any>);
};
