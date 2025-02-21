
import { MCS150FormData, UCRFormData, USDOTData } from "@/types/filing";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createMCS150Record } from "./services/mcs150-records";
import { createUCRRecord } from "./services/ucr-records";
import { createTransactionRecord, markFilingComplete } from "./services/transaction-service";

export const createTransaction = async (filingId: string, amount: number, paymentMethod: string) => {
  try {
    // First check if the filing is still in draft and get the filing data
    const { data: filing, error: filingCheckError } = await supabase
      .from('filings')
      .select(`
        *,
        usdot_info (
          id,
          legal_name,
          dba_name,
          operating_status,
          entity_type,
          physical_address,
          api_physical_address_street,
          api_physical_address_city,
          api_physical_address_state,
          api_physical_address_zip,
          api_physical_address_country,
          api_mailing_address_street,
          api_mailing_address_city,
          api_mailing_address_state,
          api_mailing_address_zip,
          api_mailing_address_country,
          telephone,
          power_units,
          drivers,
          bus_count,
          limo_count,
          minibus_count,
          motorcoach_count,
          van_count,
          complaint_count,
          out_of_service,
          out_of_service_date,
          mc_number,
          mileage_year,
          basics_data
        )
      `)
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
      const formData = filing.form_data as unknown as MCS150FormData;
      
      // Verify attachments exist and have the required properties
      const attachments = filing.attachments as Record<string, string> | null;
      if (!attachments || !attachments.signature || !attachments.license) {
        console.error('Missing required attachments:', attachments);
        throw new Error('Missing required attachments for MCS-150 filing');
      }

      await createMCS150Record(
        filingId,
        formData,
        {
          signature: attachments.signature,
          license: attachments.license
        },
        filing.usdot_number
      );
    } else if (filing.filing_type === 'ucr') {
      // Type cast UCR form data with validation
      const formData = filing.form_data as unknown;
      if (!formData || typeof formData !== 'object') {
        throw new Error('Invalid form data format');
      }
      
      const ucrFormData = formData as UCRFormData;
      
      // Create USDOTData object with null checks
      const usdotInfo = filing.usdot_info;
      if (!usdotInfo) {
        throw new Error('USDOT information not found');
      }

      // Safe type casting for basics_data
      const basicsData = usdotInfo.basics_data as { risk_score?: string } | null;

      const usdotData: USDOTData = {
        usdotNumber: filing.usdot_number,
        legalName: usdotInfo.legal_name || '',
        dbaName: usdotInfo.dba_name,
        operatingStatus: usdotInfo.operating_status,
        entityType: usdotInfo.entity_type,
        physicalAddress: usdotInfo.physical_address,
        physicalAddressStreet: usdotInfo.api_physical_address_street,
        physicalAddressCity: usdotInfo.api_physical_address_city,
        physicalAddressState: usdotInfo.api_physical_address_state,
        physicalAddressZip: usdotInfo.api_physical_address_zip,
        physicalAddressCountry: usdotInfo.api_physical_address_country || 'USA',
        mailingAddressStreet: usdotInfo.api_mailing_address_street,
        mailingAddressCity: usdotInfo.api_mailing_address_city,
        mailingAddressState: usdotInfo.api_mailing_address_state,
        mailingAddressZip: usdotInfo.api_mailing_address_zip,
        mailingAddressCountry: usdotInfo.api_mailing_address_country || 'USA',
        telephone: usdotInfo.telephone,
        powerUnits: usdotInfo.power_units,
        drivers: usdotInfo.drivers,
        busCount: usdotInfo.bus_count,
        limoCount: usdotInfo.limo_count,
        minibusCount: usdotInfo.minibus_count,
        motorcoachCount: usdotInfo.motorcoach_count,
        vanCount: usdotInfo.van_count,
        complaintCount: usdotInfo.complaint_count,
        outOfService: usdotInfo.out_of_service || false,
        outOfServiceDate: usdotInfo.out_of_service_date || null,
        mcNumber: usdotInfo.mc_number,
        mcs150FormDate: null,
        mcs150Date: null,
        mcs150Year: usdotInfo.mileage_year ? parseInt(usdotInfo.mileage_year) : undefined,
        mcs150Mileage: 0,
        carrierOperation: '',
        cargoCarried: [],
        insuranceBIPD: 0,
        insuranceBond: 0,
        insuranceCargo: 0,
        riskScore: basicsData?.risk_score || ''
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
