
import { MCS150FormData, UCRFormData, USDOTData } from "@/types/filing";
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

    // Create the transaction first
    const transactionData = await createTransactionRecord(
      filingId,
      amount,
      paymentMethod,
      filing.usdot_number,
      filing.filing_type
    );

    // Handle different filing types
    if (filing.filing_type === 'mcs150') {
      const mcs150FormData = filing.form_data as MCS150FormData;
      await createMCS150Record(
        filingId,
        mcs150FormData,
        filing.attachments as { signature?: string; license?: string },
        filing.usdot_number
      );
    } else if (filing.filing_type === 'ucr') {
      const ucrFormData = filing.form_data as UCRFormData;
      await createUCRRecord(
        filingId,
        ucrFormData,
        filing.usdot_number
      );
    }

    // Only mark as completed if transaction and records are created successfully
    await markFilingComplete(filingId);

    return transactionData;
  } catch (error) {
    console.error('Error in createTransaction:', error);
    toast({
      variant: "destructive",
      title: "Failed to process payment",
      description: "Please try again."
    });
    throw error;
  }
};
