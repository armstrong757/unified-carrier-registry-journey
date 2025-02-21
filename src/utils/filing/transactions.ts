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
        filing_type: filing.filing_type,
        usdot_number: filing.usdot_number,
        full_name: formData.representative || '',
        email: formData.email || '',
        phone: formData.phone || '',
        registration_year: formData.registrationYear?.toString() || '',
        needs_vehicle_changes: formData.needsVehicleChanges || 'no',
        vehicles_straight_trucks: parseInt(String(formData.straightTrucks || '0').replace(/,/g, '')),
        vehicles_power_units: parseInt(String(formData.straightTrucks || '0').replace(/,/g, '')),
        vehicles_passenger_vehicles: parseInt(String(formData.passengerVehicles || '0').replace(/,/g, '')),
        vehicles_add_vehicles: parseInt(String(formData.addVehicles || '0').replace(/,/g, '')),
        vehicles_exclude_vehicles: parseInt(String(formData.excludeVehicles || '0').replace(/,/g, '')),
        vehicles_total: parseInt(String(formData.straightTrucks || '0').replace(/,/g, '')) + parseInt(String(formData.passengerVehicles || '0').replace(/,/g, '')) + parseInt(String(formData.addVehicles || '0').replace(/,/g, '')) - parseInt(String(formData.excludeVehicles || '0').replace(/,/g, '')),
        classification_motor_carrier: formData.classifications?.motorCarrier || false,
        classification_motor_private: formData.classifications?.motorPrivate || false,
        classification_freight_forwarder: formData.classifications?.freightForwarder || false,
        classification_broker: formData.classifications?.broker || false,
        classification_leasing_company: formData.classifications?.leasingCompany || false,
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
        filing_type: filing.filing_type,
        usdot_number: filing.usdot_number,
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
