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

    // Verify the UCR record was created with correct vehicle data
    const { data: record, error: recordError } = await supabase
      .from('ucr_airtable_records')
      .select(`
        id,
        vehicles_total,
        vehicles_straight_trucks,
        vehicles_power_units,
        vehicles_passenger_vehicles,
        vehicles_add_vehicles,
        vehicles_exclude_vehicles,
        needs_vehicle_changes,
        payment_status,
        payment_method,
        payment_amount
      `)
      .eq('id', filingId)
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

export const createTestTransaction = async (filing: any) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      filing_id: filing.id,
      amount: 100,
      status: 'completed',
      payment_method: 'test',
      usdot_number: filing.usdot_number,
      filing_type: filing.filing_type
    });

  if (error) throw error;
  return data;
};

// Example usage in browser console:
// import { testUCRFilingCompletion } from '@/utils/testUtils';
// testUCRFilingCompletion('your-filing-id').then(console.log).catch(console.error);
