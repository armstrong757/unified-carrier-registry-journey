
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

  // Ensure we have a valid reason for filing
  if (!formData.reasonForFiling) {
    console.error('Missing reason for filing:', formData);
    throw new Error('Missing required field: reason for filing');
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
    reason_for_filing: formData.reasonForFiling,

    // Address fields with new naming convention
    form_physical_address_street: formData.principalAddress?.address || '',
    form_physical_address_city: formData.principalAddress?.city || '',
    form_physical_address_state: formData.principalAddress?.state || '',
    form_physical_address_zip: formData.principalAddress?.zip || '',
    form_physical_address_country: formData.principalAddress?.country || 'USA',
    form_mailing_address_street: formData.mailingAddress?.address || '',
    form_mailing_address_city: formData.mailingAddress?.city || '',
    form_mailing_address_state: formData.mailingAddress?.state || '',
    form_mailing_address_zip: formData.mailingAddress?.zip || '',
    form_mailing_address_country: formData.mailingAddress?.country || 'USA',
    address_modified: formData.address_modified || false,

    // Add required but unused fields with default values
    cargo_agricultural: false,
    cargo_beverages: false,
    cargo_building_materials: false,
    cargo_chemicals: false,
    cargo_coal: false,
    cargo_commodities_dry_bulk: false,
    cargo_construction: false,
    cargo_drive_away: false,
    cargo_fresh_produce: false,
    cargo_garbage: false,
    cargo_general_freight: false,
    cargo_grain: false,
    cargo_household_goods: false,
    cargo_intermodal_containers: false,
    cargo_liquids_gases: false,
    cargo_livestock: false,
    cargo_logs: false,
    cargo_machinery: false,
    cargo_meat: false,
    cargo_metal_sheets: false,
    cargo_mobile_homes: false,
    cargo_motor_vehicles: false,
    cargo_oilfield_equipment: false,
    cargo_other: false,
    cargo_paper_products: false,
    cargo_passengers: false,
    cargo_refrigerated_food: false,
    cargo_us_mail: false,
    cargo_utilities: false,
    cargo_water_well: false
  };

  console.log('Creating MCS-150 record:', mcs150Record);

  // Use upsert instead of insert to handle potential duplicates
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
