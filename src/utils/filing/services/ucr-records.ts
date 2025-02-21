
import { supabase } from "@/integrations/supabase/client";
import { UCRFormData } from "@/types/filing";

export const createUCRRecord = async (
  filingId: string,
  formData: UCRFormData,
  usdotNumber: string
) => {
  // Calculate total vehicles
  const straightTrucks = parseInt(String(formData.straightTrucks || '0').replace(/,/g, ''));
  const passengerVehicles = parseInt(String(formData.passengerVehicles || '0').replace(/,/g, ''));
  const addVehicles = formData.needsVehicleChanges === "yes" ? 
                     parseInt(String(formData.addVehicles || '0').replace(/,/g, '')) : 0;
  const excludeVehicles = formData.needsVehicleChanges === "yes" ? 
                        parseInt(String(formData.excludeVehicles || '0').replace(/,/g, '')) : 0;
  
  const totalVehicles = straightTrucks + passengerVehicles + addVehicles - excludeVehicles;

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
    physical_address_street: '',  // Required by schema
    physical_address_city: '',    // Required by schema
    physical_address_state: '',   // Required by schema
    physical_address_zip: '',     // Required by schema
    physical_address_country: 'USA', // Required by schema
    created_at: new Date().toISOString()
  };

  const { error: ucrError } = await supabase
    .from('ucr_airtable_records')
    .insert(ucrRecord);

  if (ucrError) {
    console.error('Error creating UCR airtable record:', ucrError);
    throw ucrError;
  }
};
