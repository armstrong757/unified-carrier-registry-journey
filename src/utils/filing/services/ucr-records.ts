
import { supabase } from "@/integrations/supabase/client";
import { UCRFormData, USDOTData } from "@/types/filing";

export const createUCRRecord = async (
  filingId: string,
  formData: UCRFormData,
  usdotNumber: string,
  usdotData: USDOTData // Now required parameter
) => {
  // Calculate total vehicles
  const straightTrucks = parseInt(String(formData.straightTrucks || '0').replace(/,/g, ''));
  const passengerVehicles = parseInt(String(formData.passengerVehicles || '0').replace(/,/g, ''));
  const addVehicles = formData.needsVehicleChanges === "yes" ? 
                     parseInt(String(formData.addVehicles || '0').replace(/,/g, '')) : 0;
  const excludeVehicles = formData.needsVehicleChanges === "yes" ? 
                        parseInt(String(formData.excludeVehicles || '0').replace(/,/g, '')) : 0;
  
  const totalVehicles = straightTrucks + passengerVehicles + addVehicles - excludeVehicles;

  console.log('Creating UCR record with USDOT data:', { usdotData });

  const ucrRecord = {
    usdot_number: usdotNumber,
    filing_type: 'ucr' as const,
    full_name: formData.representative || '',
    email: formData.email || '',
    phone: formData.phone || '',
    registration_year: formData.registrationYear?.toString() || '',
    needs_vehicle_changes: formData.needsVehicleChanges || 'no',
    vehicles_straight_trucks: straightTrucks,
    vehicles_power_units: straightTrucks,
    vehicles_passenger_vehicles: passengerVehicles,
    vehicles_add_vehicles: addVehicles,
    vehicles_exclude_vehicles: excludeVehicles,
    vehicles_total: totalVehicles,
    classification_motor_carrier: formData.classifications?.motorCarrier || false,
    classification_motor_private: formData.classifications?.motorPrivate || false,
    classification_freight_forwarder: formData.classifications?.freightForwarder || false,
    classification_broker: formData.classifications?.broker || false,
    classification_leasing_company: formData.classifications?.leasingCompany || false,
    // Include address data from USDOT info
    api_physical_address_street: usdotData.physicalAddressStreet,
    api_physical_address_city: usdotData.physicalAddressCity,
    api_physical_address_state: usdotData.physicalAddressState,
    api_physical_address_zip: usdotData.physicalAddressZip,
    api_physical_address_country: usdotData.physicalAddressCountry,
    api_mailing_address_street: usdotData.mailingAddressStreet || usdotData.physicalAddressStreet,
    api_mailing_address_city: usdotData.mailingAddressCity || usdotData.physicalAddressCity,
    api_mailing_address_state: usdotData.mailingAddressState || usdotData.physicalAddressState,
    api_mailing_address_zip: usdotData.mailingAddressZip || usdotData.physicalAddressZip,
    api_mailing_address_country: usdotData.mailingAddressCountry || 'USA',
    created_at: new Date().toISOString()
  };

  console.log('Inserting UCR record:', ucrRecord);

  const { error: ucrError } = await supabase
    .from('ucr_airtable_records')
    .insert(ucrRecord);

  if (ucrError) {
    console.error('Error creating UCR airtable record:', ucrError);
    throw ucrError;
  }

  // Also update the USDOT info table with the address data
  const { error: usdotError } = await supabase
    .from('usdot_info')
    .upsert({
      usdot_number: usdotNumber,
      api_physical_address_street: usdotData.physicalAddressStreet,
      api_physical_address_city: usdotData.physicalAddressCity,
      api_physical_address_state: usdotData.physicalAddressState,
      api_physical_address_zip: usdotData.physicalAddressZip,
      api_physical_address_country: usdotData.physicalAddressCountry,
      api_mailing_address_street: usdotData.mailingAddressStreet || usdotData.physicalAddressStreet,
      api_mailing_address_city: usdotData.mailingAddressCity || usdotData.physicalAddressCity,
      api_mailing_address_state: usdotData.mailingAddressState || usdotData.physicalAddressState,
      api_mailing_address_zip: usdotData.mailingAddressZip || usdotData.physicalAddressZip,
      api_mailing_address_country: usdotData.mailingAddressCountry || 'USA',
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'usdot_number'
    });

  if (usdotError) {
    console.error('Error updating USDOT info:', usdotError);
    // Don't throw here as the UCR record was created successfully
  }
};
