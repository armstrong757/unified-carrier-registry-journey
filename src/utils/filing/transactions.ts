import { supabase } from "@/integrations/supabase/client";
import { MCS150FormData, UCRFormData } from "@/types/filing";
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

    // Create the transaction with completed status
    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          filing_id: filingId,
          amount,
          status: 'completed',
          payment_method: paymentMethod
        }
      ])
      .select()
      .maybeSingle();

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      throw transactionError;
    }

    // Handle different filing types
    if (filing.filing_type === 'mcs150') {
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
        // For company identifier, use the same logic as operator
        company_ein: formData.companyIdentifierType === 'ein' ? formData.companyIdentifier : null,
        company_ssn: formData.companyIdentifierType === 'ssn' ? formData.companyIdentifier : null,
        // Convert miles driven string to number
        operator_miles_driven: operator.milesDriven ? parseInt(operator.milesDriven.replace(/,/g, '')) : null,
        reason_for_filing: formData.reasonForFiling || '',
        has_changes: formData.hasChanges === 'yes',
        changes_to_make: formData.changesToMake || {},
        company_info_changes: formData.companyInfoChanges || {},
        operating_info_changes: formData.operatingInfoChanges || {},
        payment_amount: amount,
        payment_method: paymentMethod,
        payment_status: 'completed',
        created_at: new Date().toISOString(),
        // Add all the required cargo fields with default values
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

      console.log('Creating airtable record:', record);

      const { error: airtableError } = await supabase
        .from('mcs150_airtable_records')
        .insert(record);

      if (airtableError) {
        console.error('Error creating airtable record:', airtableError);
        throw airtableError;
      }
    } else if (filing.filing_type === 'ucr') {
      console.log('Processing UCR filing:', filing);
      
      const formData = filing.form_data as UCRFormData;
      
      // Calculate total vehicles
      const straightTrucks = parseInt(String(formData.straightTrucks || '0').replace(/,/g, ''));
      const passengerVehicles = parseInt(String(formData.passengerVehicles || '0').replace(/,/g, ''));
      const addVehicles = formData.needsVehicleChanges === "yes" ? 
                         parseInt(String(formData.addVehicles || '0').replace(/,/g, '')) : 0;
      const excludeVehicles = formData.needsVehicleChanges === "yes" ? 
                            parseInt(String(formData.excludeVehicles || '0').replace(/,/g, '')) : 0;
      
      const totalVehicles = straightTrucks + passengerVehicles + addVehicles - excludeVehicles;

      // Convert the form data to match the table structure
      const record = {
        id: filing.id,
        filing_type: filing.filing_type,
        usdot_number: filing.usdot_number,
        full_name: formData.representative || '',
        email: formData.email || '',
        phone: formData.phone || '',
        registration_year: formData.registrationYear?.toString() || '',
        needs_vehicle_changes: formData.needsVehicleChanges || 'no',
        vehicles_straight_trucks: straightTrucks,
        vehicles_power_units: straightTrucks, // Same as straight trucks for UCR
        vehicles_passenger_vehicles: passengerVehicles,
        vehicles_add_vehicles: addVehicles,
        vehicles_exclude_vehicles: excludeVehicles,
        vehicles_total: totalVehicles,
        classification_motor_carrier: formData.classifications?.motorCarrier || false,
        classification_motor_private: formData.classifications?.motorPrivate || false,
        classification_freight_forwarder: formData.classifications?.freightForwarder || false,
        classification_broker: formData.classifications?.broker || false,
        classification_leasing_company: formData.classifications?.leasingCompany || false,
        created_at: new Date().toISOString()
      };

      console.log('Creating UCR airtable record:', record);

      const { error: airtableError } = await supabase
        .from('ucr_airtable_records')
        .insert(record);

      if (airtableError) {
        console.error('Error creating UCR airtable record:', airtableError);
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
