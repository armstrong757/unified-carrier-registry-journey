
import { supabase } from "@/integrations/supabase/client";
import { MCS150FormData } from "@/types/filing";

interface FilingAttachments {
  signature?: string;
  license?: string;
}

interface USDOTInfoType {
  api_physical_address_street?: string;
  api_physical_address_city?: string;
  api_physical_address_state?: string;
  api_physical_address_zip?: string;
  api_physical_address_country?: string;
  physical_address?: string;
}

export const createMCS150Record = async (
  filingId: string,
  formData: MCS150FormData,
  attachments: FilingAttachments,
  usdotNumber: string,
  transactionId: string,
  usdotInfo: USDOTInfoType
) => {
  // Validate required parameters
  if (!filingId || !formData || !usdotNumber || !transactionId) {
    console.error('Missing required parameters:', { filingId, formData, usdotNumber, transactionId });
    throw new Error('Missing required parameters for MCS-150 record creation');
  }

  // Validate attachments
  if (!attachments?.signature || !attachments?.license) {
    console.error('Missing required attachments:', attachments);
    throw new Error('Missing required attachments for MCS-150 filing');
  }

  // Validate operator data
  if (!formData.operator) {
    console.error('Missing operator data in form data');
    throw new Error('Missing operator information for MCS-150 filing');
  }

  // Convert milesDriven from string to number, removing commas
  const milesDriven = parseInt(String(formData.operator?.milesDriven || '0').replace(/,/g, ''));

  // Extract identifier type and value
  const identifierType = formData.operator?.identifierType;
  const identifierValue = formData.operator?.einSsn;

  console.log('Processing identifier:', { identifierType, identifierValue });

  const mcs150Record = {
    filing_id: filingId,
    usdot_number: usdotNumber,
    filing_type: 'mcs150' as const,
    operator_first_name: formData.operator?.firstName || '',
    operator_last_name: formData.operator?.lastName || '',
    operator_email: formData.operator?.email || '',
    operator_phone: formData.operator?.phone || '',
    operator_title: formData.operator?.title || '',
    // Map SSN/EIN based on identifier type
    operator_ssn: identifierType === 'ssn' ? identifierValue : '',
    operator_ein: identifierType === 'ein' ? identifierValue : '',
    operator_miles_driven: milesDriven,
    signature_url: attachments.signature,
    license_url: attachments.license,
    created_at: new Date().toISOString(),
    reason_for_filing: formData.reasonForFiling || 'biennialUpdate',
    transaction_id: transactionId,
    
    // Store original physical address data
    principal_address_street: usdotInfo.api_physical_address_street || '',
    principal_address_city: usdotInfo.api_physical_address_city || '',
    principal_address_state: usdotInfo.api_physical_address_state || '',
    principal_address_zip: usdotInfo.api_physical_address_zip || '',
    principal_address_country: usdotInfo.api_physical_address_country || 'USA',

    // Store form-submitted address data
    form_physical_address_street: formData.address_modified ? formData.principalAddress?.address || '' : '',
    form_physical_address_city: formData.address_modified ? formData.principalAddress?.city || '' : '',
    form_physical_address_state: formData.address_modified ? formData.principalAddress?.state || '' : '',
    form_physical_address_zip: formData.address_modified ? formData.principalAddress?.zip || '' : '',
    form_physical_address_country: formData.address_modified ? formData.principalAddress?.country || 'USA' : '',

    // Track if address was modified
    address_modified: formData.address_modified || false
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
