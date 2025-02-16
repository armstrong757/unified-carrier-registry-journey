
import { supabase } from "@/integrations/supabase/client";
import { FilingType } from "@/types/filing";

export const createFiling = async (usdotNumber: string, filingType: FilingType, initialFormData: any = {}) => {
  try {
    const { data, error } = await supabase
      .from('filings')
      .insert([
        {
          usdot_number: usdotNumber,
          filing_type: filingType,
          form_data: initialFormData,
          status: 'draft'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating filing:', error);
    throw error;
  }
};

export const updateFilingData = async (filingId: string, formData: any) => {
  try {
    const { data, error } = await supabase
      .from('filings')
      .update({
        form_data: formData,
        updated_at: new Date().toISOString()
      })
      .eq('id', filingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating filing:', error);
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
      .single();

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
