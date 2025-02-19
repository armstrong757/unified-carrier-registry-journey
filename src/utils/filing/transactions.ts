
import { supabase } from "@/integrations/supabase/client";
import { MCS150FormData } from "@/types/filing";

interface FilingAttachments {
  signature?: string;
  license?: string;
}

export const createTransaction = async (filingId: string, amount: number, paymentMethod: string) => {
  try {
    // First check if the filing is still in draft
    const { data: filing, error: filingCheckError } = await supabase
      .from('filings')
      .select('status, form_data, attachments, filing_type, usdot_number')
      .eq('id', filingId)
      .maybeSingle();

    if (filingCheckError) throw filingCheckError;
    if (!filing || filing.status !== 'draft') {
      throw new Error('Filing is not in draft status');
    }

    const attachments = filing.attachments as FilingAttachments;

    // Verify attachments exist for MCS-150 filings
    if (filing.filing_type === 'mcs150' && (!attachments?.signature || !attachments?.license)) {
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
    if (filing.filing_type === 'mcs150' && attachments) {
      console.log('Processing MCS-150 attachments:', attachments);
      
      const formData = filing.form_data as unknown as MCS150FormData;
      const operator = formData.operator || {};
      
      // Convert the form data to match the table structure
      const record = {
        filing_id: filingId,
        usdot_number: filing.usdot_number,
        filing_type: filing.filing_type,
        signature_url: attachments.signature || '',
        license_url: attachments.license || '',
        operator_first_name: operator.firstName || '',
        operator_last_name: operator.lastName || '',
        operator_email: operator.email || '',
        operator_phone: operator.phone || '',
        operator_title: operator.title || '',
        operator_ein_ssn: operator.einSsn || '',
        operator_miles_driven: operator.milesDriven || '',
        reason_for_filing: formData.reasonForFiling || '',
        has_changes: formData.hasChanges === 'yes',
        changes_to_make: formData.changesToMake || {},
        company_info_changes: formData.companyInfoChanges || {},
        operating_info_changes: formData.operatingInfoChanges || {},
        payment_amount: amount,
        payment_method: paymentMethod,
        payment_status: 'pending',
        created_at: new Date().toISOString()
      };

      const { error: airtableError } = await supabase
        .from('mcs150_airtable_records')
        .insert(record);

      if (airtableError) {
        console.error('Error creating airtable record:', airtableError);
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
