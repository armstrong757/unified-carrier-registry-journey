
import { supabase } from "@/integrations/supabase/client";
import { FilingType } from "@/types/filing";

export const createTransactionRecord = async (
  filingId: string,
  amount: number,
  paymentMethod: string,
  usdotNumber: string,
  filingType: FilingType
) => {
  const { data: transactionData, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      filing_id: filingId,
      amount,
      status: 'completed',
      payment_method: paymentMethod,
      usdot_number: usdotNumber,
      filing_type: filingType
    })
    .select('*')
    .single();

  if (transactionError) {
    console.error('Error creating transaction:', transactionError);
    throw transactionError;
  }

  return transactionData;
};

export const markFilingComplete = async (filingId: string) => {
  const { error: filingError } = await supabase
    .from('filings')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', filingId)
    .eq('status', 'draft');

  if (filingError) {
    console.error('Error updating filing:', filingError);
    throw filingError;
  }
};
