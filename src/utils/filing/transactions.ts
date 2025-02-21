
import { MCS150FormData, UCRFormData } from "@/types/filing";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createMCS150Record } from "./services/mcs150-records";
import { createUCRRecord } from "./services/ucr-records";
import { createTransactionRecord, markFilingComplete } from "./services/transaction-service";

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

    console.log('Creating transaction for filing:', {
      filingId,
      amount,
      paymentMethod
    });

    // Create the transaction first
    const transactionData = await createTransactionRecord(
      filingId,
      amount,
      paymentMethod,
      filing.usdot_number,
      filing.filing_type
    );

    console.log('Transaction created successfully:', transactionData);

    // Handle different filing types
    if (filing.filing_type === 'mcs150') {
      await createMCS150Record(
        filingId,
        filing.form_data as MCS150FormData,
        filing.attachments as { signature?: string; license?: string },
        filing.usdot_number
      );
    } else if (filing.filing_type === 'ucr') {
      await createUCRRecord(
        filingId,
        filing.form_data as UCRFormData,
        filing.usdot_number
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
