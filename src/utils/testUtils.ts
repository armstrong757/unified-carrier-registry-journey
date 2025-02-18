
import { supabase } from "@/integrations/supabase/client";

export const testUCRFilingCompletion = async (filingId: string) => {
  try {
    // First update the filing status to completed
    const { data: filing, error: filingError } = await supabase
      .from('filings')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', filingId)
      .select()
      .single();

    if (filingError) throw filingError;

    // Create a test transaction without payment processing
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          filing_id: filingId,
          amount: 149, // Standard UCR fee
          status: 'completed',
          payment_method: 'test'
        }
      ])
      .select()
      .single();

    if (transactionError) throw transactionError;

    // The populate_airtable_record trigger will automatically create the record
    // Verify the UCR record was created with correct vehicle data
    const { data: record, error: recordError } = await supabase
      .from('ucr_airtable_records')
      .select(`
        filing_id,
        total_vehicles,
        ucr_straight_trucks,
        ucr_power_units,
        ucr_passenger_vehicles,
        ucr_add_vehicles,
        ucr_exclude_vehicles,
        payment_status,
        payment_method,
        payment_amount
      `)
      .eq('filing_id', filingId)
      .single();

    if (recordError) throw recordError;

    console.log('Test Filing Completed:', {
      filing,
      transaction,
      ucrRecord: record
    });
    
    return record;
  } catch (error) {
    console.error('Error testing filing completion:', error);
    throw error;
  }
};

// Example usage in browser console:
// import { testUCRFilingCompletion } from '@/utils/testUtils';
// testUCRFilingCompletion('your-filing-id').then(console.log).catch(console.error);
