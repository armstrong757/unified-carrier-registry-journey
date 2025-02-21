
import { supabase } from "@/integrations/supabase/client";
import { FilingType, UCRFormData } from "@/types/filing";
import { calculateUCRFee } from "@/utils/ucrFeeCalculator";

interface Filing {
  id: string;
  usdot_number: string;
  filing_type: FilingType;
  form_data: any;
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

    // Calculate UCR fee based on total vehicles
    const ucrFormData = filing.form_data as UCRFormData;
    const straightTrucks = parseInt(String(ucrFormData.straightTrucks || '0').replace(/,/g, ''));
    const passengerVehicles = parseInt(String(ucrFormData.passengerVehicles || '0').replace(/,/g, ''));
    const addVehicles = ucrFormData.needsVehicleChanges === "yes" ? 
                     parseInt(String(ucrFormData.addVehicles || '0').replace(/,/g, '')) : 0;
    const excludeVehicles = ucrFormData.needsVehicleChanges === "yes" ? 
                        parseInt(String(ucrFormData.excludeVehicles || '0').replace(/,/g, '')) : 0;
    
    const totalVehicles = straightTrucks + passengerVehicles + addVehicles - excludeVehicles;
    const ucrFee = calculateUCRFee(totalVehicles);

    // Create a test transaction with all required fields
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        filing_id: filingId,
        amount: ucrFee,
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
  let amount = 100; // Default amount for non-UCR filings

  // Calculate UCR fee if it's a UCR filing
  if (filing.filing_type === 'ucr') {
    const ucrFormData = filing.form_data as UCRFormData;
    const straightTrucks = parseInt(String(ucrFormData.straightTrucks || '0').replace(/,/g, ''));
    const passengerVehicles = parseInt(String(ucrFormData.passengerVehicles || '0').replace(/,/g, ''));
    const addVehicles = ucrFormData.needsVehicleChanges === "yes" ? 
                     parseInt(String(ucrFormData.addVehicles || '0').replace(/,/g, '')) : 0;
    const excludeVehicles = ucrFormData.needsVehicleChanges === "yes" ? 
                        parseInt(String(ucrFormData.excludeVehicles || '0').replace(/,/g, '')) : 0;
    
    const totalVehicles = straightTrucks + passengerVehicles + addVehicles - excludeVehicles;
    amount = calculateUCRFee(totalVehicles);
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      filing_id: filing.id,
      amount,
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
