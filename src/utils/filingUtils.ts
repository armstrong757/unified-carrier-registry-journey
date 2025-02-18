
import { supabase } from "@/integrations/supabase/client";
import { FilingType, USDOTData } from "@/types/filing";
import { flattenFormData, uploadFormAttachment } from "./fileUtils";

// Helper function to remove credit card information and handle file uploads
const sanitizeAndProcessFormData = async (formData: any, usdotNumber: string) => {
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

export const createFiling = async (usdotNumber: string, filingType: FilingType, initialFormData: any = {}) => {
  try {
    const usdotData = initialFormData.usdotData as USDOTData;
    
    // Prepare USDOT info record
    const usdotRecord = {
      usdot_number: usdotNumber,
      legal_name: usdotData?.legalName || 'Unknown',
      dba_name: usdotData?.dbaName,
      operating_status: usdotData?.operatingStatus,
      entity_type: usdotData?.entityType,
      physical_address: usdotData?.physicalAddress,
      telephone: usdotData?.telephone,
      power_units: usdotData?.powerUnits || 0,
      drivers: usdotData?.drivers || 0,
      mcs150_last_update: usdotData?.mcs150FormDate,
      bus_count: 0,
      limo_count: 0,
      minibus_count: 0,
      motorcoach_count: 0,
      van_count: 0,
      updated_at: new Date().toISOString()
    };

    // Use upsert to either create or update the USDOT info record
    const { error: usdotError } = await supabase
      .from('usdot_info')
      .upsert(usdotRecord, {
        onConflict: 'usdot_number'
      });

    if (usdotError) throw usdotError;

    // Generate a resume token for the filing
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('generate_resume_token');
    
    if (tokenError) throw tokenError;

    // Process and sanitize form data
    const { formData, flatFormData, attachments } = await sanitizeAndProcessFormData(initialFormData, usdotNumber);

    const { data, error } = await supabase
      .from('filings')
      .insert([
        {
          usdot_number: usdotNumber,
          filing_type: filingType,
          form_data: formData,
          flat_form_data: flatFormData,
          attachments,
          status: 'draft',
          email: formData.email || formData.operator?.email,
          resume_token: tokenData,
          last_step_completed: 1
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating filing:', error);
    throw error;
  }
};

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

export const getFilingByResumeToken = async (token: string) => {
  try {
    const { data, error } = await supabase
      .from('filings')
      .select()
      .eq('resume_token', token)
      .eq('status', 'draft') // Only get draft filings
      .gt('resume_token_expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new Error('No valid filing found for this resume token');
    }
    return data;
  } catch (error) {
    console.error('Error retrieving filing by resume token:', error);
    throw error;
  }
};

export const createTransaction = async (filingId: string, amount: number, paymentMethod: string) => {
  try {
    // First check if the filing is still in draft
    const { data: filing, error: filingCheckError } = await supabase
      .from('filings')
      .select('status')
      .eq('id', filingId)
      .maybeSingle();

    if (filingCheckError) throw filingCheckError;
    if (!filing || filing.status !== 'draft') {
      throw new Error('Filing is not in draft status');
    }

    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          filing_id: filingId,
          amount,
          status: 'pending',
          payment_method: paymentMethod
        }
      ])
      .select()
      .maybeSingle();

    if (transactionError) throw transactionError;

    // Only mark as completed if transaction is created successfully
    const { error: filingError } = await supabase
      .from('filings')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', filingId)
      .eq('status', 'draft'); // Only update if still in draft

    if (filingError) throw filingError;

    return transactionData;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};
