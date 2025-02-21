
import { supabase } from "@/integrations/supabase/client";
import { FilingType } from "@/types/filing";

export const createTransactionRecord = async (
  filingId: string,
  amount: number,
  paymentMethod: string,
  usdotNumber: string,
  filingType: FilingType
) => {
  console.log('Creating transaction record:', {
    filingId,
    amount,
    paymentMethod,
    usdotNumber,
    filingType
  });

  const { data: transactionData, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      filing_id: filingId,
      amount,
      status: 'completed',
      payment_method: 'credit',
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
    .eq('id', filingId); // Removed the status='draft' check

  if (filingError) {
    console.error('Error updating filing:', filingError);
    throw filingError;
  }
};
