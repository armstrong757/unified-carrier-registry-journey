
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

  // Extract and format address data
  const principalAddress = formData.principalAddress || {};
  const mailingAddress = formData.mailingAddress || {};

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
    reason_for_filing: formData.reasonForFiling || 'biennialUpdate',
    
    // Principal address fields
    principal_address_street: principalAddress.address || '',
    principal_address_city: principalAddress.city || '',
    principal_address_state: principalAddress.state || '',
    principal_address_zip: principalAddress.zip || '',
    principal_address_country: principalAddress.country || 'USA',
    
    // Mailing address fields
    mailing_address_street: mailingAddress.address || '',
    mailing_address_city: mailingAddress.city || '',
    mailing_address_state: mailingAddress.state || '',
    mailing_address_zip: mailingAddress.zip || '',
    mailing_address_country: mailingAddress.country || 'USA',

    // Form address fields (for tracking changes)
    form_physical_address_street: principalAddress.address || '',
    form_physical_address_city: principalAddress.city || '',
    form_physical_address_state: principalAddress.state || '',
    form_physical_address_zip: principalAddress.zip || '',
    form_physical_address_country: principalAddress.country || 'USA',
    
    form_mailing_address_street: mailingAddress.address || '',
    form_mailing_address_city: mailingAddress.city || '',
    form_mailing_address_state: mailingAddress.state || '',
    form_mailing_address_zip: mailingAddress.zip || '',
    form_mailing_address_country: mailingAddress.country || 'USA',

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
