
import { supabase } from "@/integrations/supabase/client";

export const testAirtableRecordPopulation = async (filingId: string) => {
  try {
    // First create a test transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          filing_id: filingId,
          amount: 100,
          status: 'completed',
          payment_method: 'test'
        }
      ])
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Verify the airtable record was created with correct vehicle data
    const { data: record, error: recordError } = await supabase
      .from('airtable_records')
      .select(`
        filing_id,
        total_vehicles,
        ucr_straight_trucks,
        ucr_power_units,
        ucr_passenger_vehicles,
        ucr_add_vehicles,
        ucr_exclude_vehicles
      `)
      .eq('filing_id', filingId)
      .single();

    if (recordError) throw recordError;

    console.log('Airtable Record Created:', record);
    return record;
  } catch (error) {
    console.error('Error testing Airtable record population:', error);
    throw error;
  }
};
