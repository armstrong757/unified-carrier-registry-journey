
import { supabase } from "@/integrations/supabase/client";
import { MCS150FormData } from "@/types/filing";

interface FilingAttachments {
  signature?: string;
  license?: string;
}

export const createMCS150Record = async (
  filingId: string,
  formData: MCS150FormData,
  attachments: FilingAttachments,
  usdotNumber: string
) => {
  if (!attachments?.signature || !attachments?.license) {
    throw new Error('Missing required attachments for MCS-150 filing');
  }

  // Convert milesDriven from string to number, removing commas
  const milesDriven = parseInt(String(formData.operator?.milesDriven || '0').replace(/,/g, ''));

  const mcs150Record = {
    filing_id: filingId,
    usdot_number: usdotNumber,
    filing_type: 'mcs150' as const,
    operator_first_name: formData.operator?.firstName || '',
    operator_last_name: formData.operator?.lastName || '',
    operator_email: formData.operator?.email || '',
    operator_phone: formData.operator?.phone || '',
    operator_title: formData.operator?.title || '',
    operator_ssn: formData.operator?.identifierType === 'ssn' ? formData.operator.einSsn : null,
    operator_ein: formData.operator?.identifierType === 'ein' ? formData.operator.einSsn : null,
    operator_miles_driven: milesDriven,
    signature_url: attachments.signature,
    license_url: attachments.license,
    created_at: new Date().toISOString(),
    reason_for_filing: formData.reasonForFiling || 'biennialUpdate' // Use default if not set
  };

  console.log('Creating MCS-150 record:', mcs150Record);

  const { error: mcs150Error } = await supabase
    .from('mcs150_airtable_records')
    .upsert(mcs150Record, {
      onConflict: 'filing_id',
      ignoreDuplicates: false
    });

  if (mcs150Error) {
    console.error('Error creating MCS-150 record:', mcs150Error);
    throw mcs150Error;
  }
};
