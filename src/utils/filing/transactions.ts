
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

    console.log('USDOT Info fetched:', usdotInfo);

    // Transform USDOT info to match USDOTData type
    const transformedUsdotInfo: USDOTData = {
      usdotNumber: filing.usdot_number,
      legalName: usdotInfo?.legal_name || '',
      dbaName: usdotInfo?.dba_name || '',
      operatingStatus: usdotInfo?.operating_status || '',
      entityType: usdotInfo?.entity_type || '',
      physicalAddress: usdotInfo?.physical_address || '',
      physicalAddressStreet: usdotInfo?.api_physical_address_street || '',
      physicalAddressCity: usdotInfo?.api_physical_address_city || '',
      physicalAddressState: usdotInfo?.api_physical_address_state || '',
      physicalAddressZip: usdotInfo?.api_physical_address_zip || '',
      physicalAddressCountry: usdotInfo?.api_physical_address_country || 'USA',
      mailingAddressStreet: usdotInfo?.api_mailing_address_street || usdotInfo?.api_physical_address_street || '',
      mailingAddressCity: usdotInfo?.api_mailing_address_city || usdotInfo?.api_physical_address_city || '',
      mailingAddressState: usdotInfo?.api_mailing_address_state || usdotInfo?.api_physical_address_state || '',
      mailingAddressZip: usdotInfo?.api_mailing_address_zip || usdotInfo?.api_physical_address_zip || '',
      mailingAddressCountry: usdotInfo?.api_mailing_address_country || 'USA',
      telephone: usdotInfo?.telephone || '',
      powerUnits: usdotInfo?.power_units || 0,
      drivers: usdotInfo?.drivers || 0,
      busCount: usdotInfo?.bus_count || 0,
      limoCount: usdotInfo?.limo_count || 0,
      minibusCount: usdotInfo?.minibus_count || 0,
      motorcoachCount: usdotInfo?.motorcoach_count || 0,
      vanCount: usdotInfo?.van_count || 0,
      complaintCount: usdotInfo?.complaint_count || 0,
      outOfService: usdotInfo?.out_of_service || false,
      outOfServiceDate: usdotInfo?.out_of_service_date || null,
      mcNumber: usdotInfo?.mc_number || '',
      mcs150FormDate: usdotInfo?.mcs150_last_update || '',
      mcs150Date: usdotInfo?.mcs150_last_update || '',
      // Default values for required fields not in database
      mcs150Year: 0,
      mcs150Mileage: 0,
      carrierOperation: '',
      cargoCarried: [],
      insuranceBIPD: 0,
      insuranceBond: 0,
      insuranceCargo: 0,
      riskScore: ''
    };

    console.log('Transformed USDOT Info:', transformedUsdotInfo);

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
        transformedUsdotInfo // Always pass the transformed USDOT info
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
