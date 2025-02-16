
import { supabase } from "@/integrations/supabase/client";
import { FilingType } from "@/types/filing";

export const createFiling = async (usdotNumber: string, filingType: FilingType, initialFormData: any = {}) => {
  try {
    // Generate a resume token for the filing
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('generate_resume_token');
    
    if (tokenError) throw tokenError;

    const { data, error } = await supabase
      .from('filings')
      .insert([
        {
          usdot_number: usdotNumber,
          filing_type: filingType,
          form_data: initialFormData,
          status: 'draft',
          email: initialFormData.email,
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
    const { data, error } = await supabase
      .from('filings')
      .update({
        form_data: formData,
        email: formData.email,
        last_step_completed: currentStep,
        updated_at: new Date().toISOString()
      })
      .eq('id', filingId)
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

    const { error: filingError } = await supabase
      .from('filings')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', filingId);

    if (filingError) throw filingError;

    return transactionData;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};
