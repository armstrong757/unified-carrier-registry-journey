
import { supabase } from "@/integrations/supabase/client";
import { FilingType } from "@/types/filing";

interface Filing {
  id: string;
  usdot_number: string;
  filing_type: FilingType;
}

export const testUCRFilingCompletion = async (filingId: string) => {
  try {
    // First get the filing data
    const { data: filing, error: getFilingError } = await supabase
      .from('filings')
      .select('*')
      .eq('id', filingId)
      .single();

    if (getFilingError) throw getFilingError;
    if (!filing) throw new Error('Filing not found');

    // Update filing status to completed
    const { error: filingError } = await supabase
      .from('filings')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', filingId);

    if (filingError) throw filingError;

    // Create a test transaction with all required fields
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        filing_id: filingId,
        amount: 149,
        status: 'completed',
        payment_method: 'test',
        usdot_number: filing.usdot_number,
        filing_type: filing.filing_type
      })
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

export const createTestTransaction = async (filing: Filing) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      filing_id: filing.id,
      amount: 100,
      status: 'completed',
      payment_method: 'test',
      usdot_number: filing.usdot_number,
      filing_type: filing.filing_type
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
