
import { supabase } from "@/integrations/supabase/client";
import { sanitizeAndProcessFormData } from "./formProcessing";

export const updateFilingData = async (filingId: string, formData: any, currentStep: number) => {
  try {
    // Get the USDOT number for the filing
    const { data: filing, error: filingError } = await supabase
      .from('filings')
      .select('usdot_number')
      .eq('id', filingId)
      .single();

    if (filingError) throw filingError;

    // Process and sanitize form data
    const { formData: sanitizedFormData, flatFormData, attachments, fileData } = 
      await sanitizeAndProcessFormData(formData, filing.usdot_number);

    const { data, error } = await supabase
      .from('filings')
      .update({
        form_data: sanitizedFormData,
        flat_form_data: flatFormData,
        attachments,
        file_data: fileData,
        email: sanitizedFormData.email || sanitizedFormData.operator?.email,
        last_step_completed: currentStep,
        updated_at: new Date().toISOString()
      })
      .eq('id', filingId)
      .eq('status', 'draft')
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating filing:', error);
    throw error;
  }
};
