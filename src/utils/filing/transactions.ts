
import { supabase } from "@/integrations/supabase/client";

export const createTransaction = async (filingId: string, amount: number, paymentMethod: string) => {
  try {
    // First check if the filing is still in draft
    const { data: filing, error: filingCheckError } = await supabase
      .from('filings')
      .select('status, form_data, attachments, filing_type')
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

    // Update airtable records with URLs based on filing type
    if (filing.attachments && typeof filing.attachments === 'object') {
      const attachments = filing.attachments as Record<string, string>;
      
      if (filing.filing_type === 'mcs150') {
        const { error: airtableError } = await supabase
          .from('mcs150_airtable_records')
          .update({
            signature_url: attachments.signature,
            license_url: attachments.license
          })
          .eq('filing_id', filingId);

        if (airtableError) throw airtableError;
      }
    }

    // Only mark as completed if transaction is created successfully
    const { error: filingError } = await supabase
      .from('filings')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', filingId)
      .eq('status', 'draft');

    if (filingError) throw filingError;

    return transactionData;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};
