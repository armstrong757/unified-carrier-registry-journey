
import { MCS150FormData, UCRFormData } from "@/types/filing";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createMCS150Record } from "./services/mcs150-records";
import { createUCRRecord } from "./services/ucr-records";
import { createTransactionRecord, markFilingComplete } from "./services/transaction-service";
import { calculateUCRFee } from "@/utils/ucrFeeCalculator";

export const createTransaction = async (filingId: string, amount: number, paymentMethod: string) => {
  try {
    // First check if the filing is still in draft and get the filing data
    const { data: filing, error: filingCheckError } = await supabase
      .from('filings')
      .select('*')
      .eq('id', filingId)
      .maybeSingle();

    if (filingCheckError) {
      console.error('Error checking filing:', filingCheckError);
      throw filingCheckError;
    }
    
    if (!filing || filing.status !== 'draft') {
      throw new Error('Filing is not in draft status');
    }

    // Fetch USDOT info separately
    const { data: usdotInfo, error: usdotError } = await supabase
      .from('usdot_info')
      .select('*')
      .eq('usdot_number', filing.usdot_number)
      .maybeSingle();

    if (usdotError) {
      console.error('Error fetching USDOT info:', usdotError);
      // Don't throw here, we can proceed without USDOT info
    }

    // For UCR filings, calculate the fee based on total vehicles
    let transactionAmount = amount;
    if (filing.filing_type === 'ucr') {
      const ucrFormData = filing.form_data as unknown as UCRFormData;
      const straightTrucks = parseInt(String(ucrFormData.straightTrucks || '0').replace(/,/g, ''));
      const passengerVehicles = parseInt(String(ucrFormData.passengerVehicles || '0').replace(/,/g, ''));
      const addVehicles = ucrFormData.needsVehicleChanges === "yes" ? 
                       parseInt(String(ucrFormData.addVehicles || '0').replace(/,/g, '')) : 0;
      const excludeVehicles = ucrFormData.needsVehicleChanges === "yes" ? 
                          parseInt(String(ucrFormData.excludeVehicles || '0').replace(/,/g, '')) : 0;
      
      const totalVehicles = straightTrucks + passengerVehicles + addVehicles - excludeVehicles;
      transactionAmount = calculateUCRFee(totalVehicles);
    }

    console.log('Creating transaction for filing:', {
      filingId,
      amount: transactionAmount,
      paymentMethod
    });

    // Create the transaction first
    const transactionData = await createTransactionRecord(
      filingId,
      transactionAmount,
      paymentMethod,
      filing.usdot_number,
      filing.filing_type
    );

    console.log('Transaction created successfully:', transactionData);

    // Handle different filing types
    if (filing.filing_type === 'mcs150') {
      const mcs150FormData = filing.form_data as unknown as MCS150FormData;
      await createMCS150Record(
        filingId,
        mcs150FormData,
        filing.attachments as { signature?: string; license?: string },
        filing.usdot_number
      );
    } else if (filing.filing_type === 'ucr') {
      const ucrFormData = filing.form_data as unknown as UCRFormData;
      await createUCRRecord(
        filingId,
        ucrFormData,
        filing.usdot_number,
        usdotInfo || undefined // Pass USDOT info if available, otherwise undefined
      );
    }

    // Only mark as completed if transaction and records are created successfully
    console.log('Updating filing status to completed');
    await markFilingComplete(filingId);

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
