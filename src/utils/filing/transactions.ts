
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
      .select('*, id')
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
      // Ensure we're working with MCS150 data
      const formData = filing.form_data as MCS150FormData;
      const attachments = filing.attachments as FilingAttachments;
      
      if (!attachments?.signature || !attachments?.license) {
        throw new Error('Missing required attachments for MCS-150 filing');
      }

      const mcs150Record = {
        filing_id: filingId,
        usdot_number: filing.usdot_number,
        operator_first_name: formData.operator?.firstName || '',
        operator_last_name: formData.operator?.lastName || '',
        operator_email: formData.operator?.email || '',
        operator_phone: formData.operator?.phone || '',
        operator_title: formData.operator?.title || '',
        operator_ssn: formData.operator?.identifierType === 'ssn' ? formData.operator.einSsn : null,
        operator_ein: formData.operator?.identifierType === 'ein' ? formData.operator.einSsn : null,
        operator_miles_driven: formData.operator?.milesDriven || '',
        signature_url: attachments.signature,
        license_url: attachments.license,
        created_at: new Date().toISOString()
      };

      const { error: mcs150Error } = await supabase
        .from('mcs150_airtable_records')
        .insert(mcs150Record);

      if (mcs150Error) {
        console.error('Error creating MCS-150 record:', mcs150Error);
        throw mcs150Error;
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

      // Create record matching the exact table schema
      const ucrRecord = {
        usdot_number: filing.usdot_number,
        filing_type: filing.filing_type as 'ucr',
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

      console.log('Creating UCR airtable record:', ucrRecord);

      const { error: ucrError } = await supabase
        .from('ucr_airtable_records')
        .insert(ucrRecord);

      if (ucrError) {
        console.error('Error creating UCR airtable record:', ucrError);
        throw ucrError;
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
