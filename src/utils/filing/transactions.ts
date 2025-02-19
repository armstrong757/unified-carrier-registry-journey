
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

    // Verify attachments exist for MCS-150 filings
    if (filing.filing_type === 'mcs150' && (!filing.attachments?.signature || !filing.attachments?.license)) {
      throw new Error('Missing required attachments for MCS-150 filing');
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
    if (filing.filing_type === 'mcs150') {
      console.log('Processing MCS-150 attachments:', filing.attachments);
      
      const { error: airtableError } = await supabase
        .from('mcs150_airtable_records')
        .update({
          signature_url: filing.attachments.signature,
          license_url: filing.attachments.license
        })
        .eq('filing_id', filingId);

      if (airtableError) {
        console.error('Error updating airtable record:', airtableError);
        throw airtableError;
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
