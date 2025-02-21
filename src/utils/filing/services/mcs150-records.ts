
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
  api_mailing_address_street?: string;
  api_mailing_address_city?: string;
  api_mailing_address_state?: string;
  api_mailing_address_zip?: string;
  api_mailing_address_country?: string;
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

  // Extract and format address data with proper null checks
  const principalAddress = formData.principalAddress || {};
  const mailingAddress = formData.mailingAddress || {};

  // Validate USDOT info
  if (!usdotInfo) {
    console.error('Missing USDOT info');
    throw new Error('Missing USDOT information for MCS-150 filing');
  }

  const mcs150Record = {
    filing_id: filingId,
    usdot_number: usdotNumber,
    filing_type: 'mcs150' as const,
    operator_first_name: formData.operator?.firstName || '',
    operator_last_name: formData.operator?.lastName || '',
    operator_email: formData.operator?.email || '',
    operator_phone: formData.operator?.phone || '',
    operator_title: formData.operator?.title || '',
    operator_ssn: formData.operator?.identifierType === 'ssn' ? formData.operator.einSsn : '',
    operator_ein: formData.operator?.identifierType === 'ein' ? formData.operator.einSsn : '',
    operator_miles_driven: milesDriven,
    signature_url: attachments.signature,
    license_url: attachments.license,
    created_at: new Date().toISOString(),
    reason_for_filing: formData.reasonForFiling || 'biennialUpdate',
    transaction_id: transactionId,
    
    // Store original API address data
    api_physical_address_street: usdotInfo.api_physical_address_street || '',
    api_physical_address_city: usdotInfo.api_physical_address_city || '',
    api_physical_address_state: usdotInfo.api_physical_address_state || '',
    api_physical_address_zip: usdotInfo.api_physical_address_zip || '',
    api_physical_address_country: usdotInfo.api_physical_address_country || 'USA',
    
    api_mailing_address_street: usdotInfo.api_mailing_address_street || '',
    api_mailing_address_city: usdotInfo.api_mailing_address_city || '',
    api_mailing_address_state: usdotInfo.api_mailing_address_state || '',
    api_mailing_address_zip: usdotInfo.api_mailing_address_zip || '',
    api_mailing_address_country: usdotInfo.api_mailing_address_country || 'USA',

    // Store form-submitted address data only if modified
    form_physical_address_street: formData.address_modified ? principalAddress.address || '' : '',
    form_physical_address_city: formData.address_modified ? principalAddress.city || '' : '',
    form_physical_address_state: formData.address_modified ? principalAddress.state || '' : '',
    form_physical_address_zip: formData.address_modified ? principalAddress.zip || '' : '',
    form_physical_address_country: formData.address_modified ? (principalAddress.country || 'USA') : '',
    
    form_mailing_address_street: formData.address_modified ? mailingAddress.address || '' : '',
    form_mailing_address_city: formData.address_modified ? mailingAddress.city || '' : '',
    form_mailing_address_state: formData.address_modified ? mailingAddress.state || '' : '',
    form_mailing_address_zip: formData.address_modified ? mailingAddress.zip || '' : '',
    form_mailing_address_country: formData.address_modified ? (mailingAddress.country || 'USA') : '',

    // For current use in application
    principal_address_street: principalAddress.address || '',
    principal_address_city: principalAddress.city || '',
    principal_address_state: principalAddress.state || '',
    principal_address_zip: principalAddress.zip || '',
    principal_address_country: principalAddress.country || 'USA',
    
    mailing_address_street: mailingAddress.address || '',
    mailing_address_city: mailingAddress.city || '',
    mailing_address_state: mailingAddress.state || '',
    mailing_address_zip: mailingAddress.zip || '',
    mailing_address_country: mailingAddress.country || 'USA',

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
