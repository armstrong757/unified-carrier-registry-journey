
import { supabase } from "@/integrations/supabase/client";
import { MCS150FormData } from "@/types/filing";
import { toast } from "@/components/ui/use-toast";

interface FilingAttachments {
  signature?: string;
  license?: string;
}

export const createTransaction = async (filingId: string, amount: number, paymentMethod: string) => {
  try {
    // First check if the filing is still in draft and get all necessary data
    const { data: filing, error: filingCheckError } = await supabase
      .from('filings')
      .select('status, form_data, attachments, filing_type, usdot_number')
      .eq('id', filingId)
      .maybeSingle();

    if (filingCheckError) {
      console.error('Error checking filing:', filingCheckError);
      throw filingCheckError;
    }
    
    if (!filing || filing.status !== 'draft') {
      throw new Error('Filing is not in draft status');
    }

    // Ensure attachments are properly typed and present
    const attachments = filing.attachments as FilingAttachments;
    console.log('Current attachments:', attachments);

    // Verify attachments exist for MCS-150 filings
    if (filing.filing_type === 'mcs150') {
      if (!attachments?.signature || !attachments?.license) {
        console.error('Missing attachments:', { attachments });
        throw new Error('Missing required attachments for MCS-150 filing');
      }
    }

    // Create the transaction with completed status
    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          filing_id: filingId,
          amount,
          status: 'completed', // Changed from 'pending' to 'completed'
          payment_method: paymentMethod
        }
      ])
      .select()
      .maybeSingle();

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      throw transactionError;
    }

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
        // Handle EIN/SSN separately based on the selected type
        operator_ein: operator.identifierType === 'ein' ? operator.einSsn : null,
        operator_ssn: operator.identifierType === 'ssn' ? operator.einSsn : null,
        operator_miles_driven: operator.milesDriven ? operator.milesDriven.replace(/,/g, '') : null,
        reason_for_filing: formData.reasonForFiling || '',
        has_changes: formData.hasChanges === 'yes',
        changes_to_make: formData.changesToMake || {},
        company_info_changes: formData.companyInfoChanges || {},
        operating_info_changes: formData.operatingInfoChanges || {},
        payment_amount: amount,
        payment_method: paymentMethod,
        payment_status: 'completed', // Set to completed
        created_at: new Date().toISOString()
      };

      console.log('Creating airtable record:', record);

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

    if (filingError) {
      console.error('Error updating filing:', filingError);
      throw filingError;
    }

    return transactionData;
  } catch (error) {
    console.error('Error in createTransaction:', error);
    toast({
      variant: "destructive",
      title: "Error creating transaction",
      description: error instanceof Error ? error.message : "An unexpected error occurred"
    });
    throw error;
  }
};
