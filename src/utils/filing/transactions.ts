
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
      .select('*, usdot_info(*)')
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
      // Properly type cast the form_data
      const mcs150FormData = filing.form_data as MCS150FormData;
      console.log('MCS150 form data:', mcs150FormData); // Debug log
      
      if (!mcs150FormData.reasonForFiling) {
        throw new Error('Missing reason for filing in form data');
      }

      await createMCS150Record(
        filingId,
        mcs150FormData,
        filing.attachments as { signature?: string; license?: string },
        filing.usdot_number
      );
    } else if (filing.filing_type === 'ucr') {
      const ucrFormData = filing.form_data as UCRFormData;
      const usdotData: USDOTData = {
        usdotNumber: filing.usdot_number,
        legalName: filing.usdot_info?.legal_name || '',
        dbaName: filing.usdot_info?.dba_name,
        operatingStatus: filing.usdot_info?.operating_status,
        entityType: filing.usdot_info?.entity_type,
        physicalAddress: filing.usdot_info?.physical_address,
        physicalAddressStreet: filing.usdot_info?.api_physical_address_street,
        physicalAddressCity: filing.usdot_info?.api_physical_address_city,
        physicalAddressState: filing.usdot_info?.api_physical_address_state,
        physicalAddressZip: filing.usdot_info?.api_physical_address_zip,
        physicalAddressCountry: filing.usdot_info?.api_physical_address_country || 'USA',
        mailingAddressStreet: filing.usdot_info?.api_mailing_address_street,
        mailingAddressCity: filing.usdot_info?.api_mailing_address_city,
        mailingAddressState: filing.usdot_info?.api_mailing_address_state,
        mailingAddressZip: filing.usdot_info?.api_mailing_address_zip,
        mailingAddressCountry: filing.usdot_info?.api_mailing_address_country || 'USA',
        telephone: filing.usdot_info?.telephone,
        powerUnits: filing.usdot_info?.power_units,
        drivers: filing.usdot_info?.drivers,
        busCount: filing.usdot_info?.bus_count,
        limoCount: filing.usdot_info?.limo_count,
        minibusCount: filing.usdot_info?.minibus_count,
        motorcoachCount: filing.usdot_info?.motorcoach_count,
        vanCount: filing.usdot_info?.van_count,
        complaintCount: filing.usdot_info?.complaint_count,
        outOfService: filing.usdot_info?.out_of_service || false,
        outOfServiceDate: filing.usdot_info?.out_of_service_date || null,
        mcNumber: filing.usdot_info?.mc_number,
        mcs150FormDate: null, // These fields aren't in usdot_info table
        mcs150Date: null,
        mcs150Year: filing.usdot_info?.mileage_year ? parseInt(filing.usdot_info.mileage_year) : undefined,
        mcs150Mileage: 0,
        carrierOperation: '',
        cargoCarried: [],
        insuranceBIPD: 0,
        insuranceBond: 0,
        insuranceCargo: 0,
        riskScore: filing.usdot_info?.basics_data?.risk_score || ''
      };
      
      await createUCRRecord(
        filingId,
        ucrFormData,
        filing.usdot_number,
        usdotData
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
