
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface USDOTData {
  usdotNumber: string;
  operatingStatus: string;
  entityType: string;
  legalName: string;
  dbaName: string;
  physicalAddress: string;
  telephone: string;
  powerUnits: number;
  busCount: number;
  limoCount: number;
  minibusCount: number;
  motorcoachCount: number;
  vanCount: number;
  complaintCount: number;
  outOfService: boolean;
  outOfServiceDate: string | null;
  mcNumber: string;
  mcs150LastUpdate: string;
  basicsData: Record<string, any>;
}

function validateDOTNumber(dotNumber: string): string {
  const cleanDOTNumber = dotNumber.replace(/^(USDOT)?/i, '').replace(/\s+/g, '');
  
  if (!/^\d{7}$/.test(cleanDOTNumber)) {
    throw new Error('Invalid DOT number format. Must be exactly 7 digits.');
  }
  
  return cleanDOTNumber;
}

async function fetchCarrierData(dotNumber: string, apiKey: string): Promise<any> {
  console.log('Fetching carrier data for DOT number:', dotNumber);
  
  const validDOTNumber = validateDOTNumber(dotNumber);
  
  const url = `https://mobile.fmcsa.dot.gov/qc/services/carriers/${validDOTNumber}?webKey=${apiKey}`;
  console.log('Making request to:', url);
  
  try {
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    const responseData = await response.text();
    console.log('Raw response text:', responseData);
    
    if (responseData.includes("Must provide WebKey")) {
      console.error('Invalid or missing WebKey detected');
      throw new Error('FMCSA API key appears to be invalid or missing');
    }
    
    if (!response.ok) {
      console.error('FMCSA API Error:', responseData);
      throw new Error(`FMCSA API Error (${response.status}): ${responseData}`);
    }
    
    let data;
    try {
      data = JSON.parse(responseData);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      throw new Error('Invalid response format from FMCSA API');
    }

    if (!data) {
      throw new Error('No data returned from FMCSA API');
    }

    // Log raw data for debugging
    console.log('Raw carrier data:', data);

    // Build the physical address string
    const physicalAddress = [
      data.phyStreet,
      data.phyCity,
      data.phyState,
      data.phyZipCode
    ].filter(Boolean).join(', ');

    // Map specific fields from FMCSA response to our format
    const mappedData = {
      usdotNumber: validDOTNumber,
      operatingStatus: data.allowToOperate === 'N' ? 'NOT AUTHORIZED' : 'AUTHORIZED',
      entityType: data.carrierOperation || 'CARRIER',
      legalName: data.legalName || '',
      dbaName: data.dbaName || '',
      physicalAddress: physicalAddress || '',
      telephone: data.telephone || '',
      powerUnits: data.totalPowerUnits ? parseInt(data.totalPowerUnits) : 0,
      busCount: data.busTotal ? parseInt(data.busTotal) : 0,
      limoCount: data.limousineTotal ? parseInt(data.limousineTotal) : 0,
      minibusCount: data.minibusTotal ? parseInt(data.minibusTotal) : 0,
      motorcoachCount: data.motorcoachTotal ? parseInt(data.motorcoachTotal) : 0,
      vanCount: data.vanTotal ? parseInt(data.vanTotal) : 0,
      complaintCount: data.totalComplaints ? parseInt(data.totalComplaints) : 0,
      outOfService: data.oosStatus === 'Y',
      outOfServiceDate: data.oosDate || null,
      mcNumber: data.mcNumber || '',
      mcs150LastUpdate: data.mcs150FormDate || '',
      basicsData: {},
    };

    console.log('Mapped carrier data:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('Error in fetchCarrierData:', error);
    throw error;
  }
}

async function fetchBasicsData(dotNumber: string, apiKey: string): Promise<any> {
  console.log('Fetching BASIC data for DOT number:', dotNumber);
  
  try {
    const response = await fetch(
      `https://mobile.fmcsa.dot.gov/qc/services/carriers/${dotNumber}/basics?webKey=${apiKey}`
    );
    console.log('BASIC data response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No BASIC data available for this carrier');
        return null;
      }
      const errorText = await response.text();
      console.error('BASIC data fetch error:', errorText);
      throw new Error(`FMCSA BASIC API Error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    if (!data) {
      console.log('No BASIC data returned from FMCSA API');
      return null;
    }
    
    console.log('Successfully fetched BASIC data');
    return data;
  } catch (error) {
    console.error('Error in fetchBasicsData:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dotNumber } = await req.json();
    if (!dotNumber) {
      throw new Error('DOT number is required');
    }
    
    console.log('Received request for DOT number:', dotNumber);
    
    const fmcsaApiKey = Deno.env.get('FMCSA_API_KEY');
    if (!fmcsaApiKey) {
      console.error('FMCSA API key not configured');
      throw new Error('FMCSA API key not configured');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if we already have this DOT number in our database
    const { data: existingData, error: fetchError } = await supabase
      .from('usdot_info')
      .select('*')
      .eq('usdot_number', dotNumber)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching from database:', fetchError);
      throw fetchError;
    }

    if (existingData) {
      console.log('Found existing USDOT info:', dotNumber);
      const transformedData = {
        usdotNumber: existingData.usdot_number,
        operatingStatus: existingData.operating_status,
        entityType: existingData.entity_type,
        legalName: existingData.legal_name,
        dbaName: existingData.dba_name,
        physicalAddress: existingData.physical_address,
        telephone: existingData.telephone,
        powerUnits: existingData.power_units,
        busCount: existingData.bus_count,
        limoCount: existingData.limo_count,
        minibusCount: existingData.minibus_count,
        motorcoachCount: existingData.motorcoach_count,
        vanCount: existingData.van_count,
        complaintCount: existingData.complaint_count,
        outOfService: existingData.out_of_service,
        outOfServiceDate: existingData.out_of_service_date,
        mcNumber: existingData.mc_number,
        mcs150LastUpdate: existingData.mcs150_last_update,
        basicsData: existingData.basics_data,
      };
      
      return new Response(
        JSON.stringify(transformedData),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch carrier and BASIC data in parallel
    console.log('Fetching new USDOT info from FMCSA API:', dotNumber);
    const [carrierData, basicsData] = await Promise.all([
      fetchCarrierData(dotNumber, fmcsaApiKey),
      fetchBasicsData(dotNumber, fmcsaApiKey)
    ]);

    // Create transformed data object
    const transformedData = {
      ...carrierData,
      basicsData: basicsData || {},
    };

    // Store the data in our database
    const { error: insertError } = await supabase.from('usdot_info').insert({
      usdot_number: transformedData.usdotNumber,
      operating_status: transformedData.operatingStatus,
      entity_type: transformedData.entityType,
      legal_name: transformedData.legalName,
      dba_name: transformedData.dbaName,
      physical_address: transformedData.physicalAddress,
      telephone: transformedData.telephone,
      power_units: transformedData.powerUnits,
      bus_count: transformedData.busCount,
      limo_count: transformedData.limoCount,
      minibus_count: transformedData.minibusCount,
      motorcoach_count: transformedData.motorcoachCount,
      van_count: transformedData.vanCount,
      complaint_count: transformedData.complaintCount,
      out_of_service: transformedData.outOfService,
      out_of_service_date: transformedData.outOfServiceDate,
      mc_number: transformedData.mcNumber,
      mcs150_last_update: transformedData.mcs150LastUpdate,
      basics_data: transformedData.basicsData,
    });

    if (insertError) {
      console.error('Error storing USDOT info:', insertError);
      throw insertError;
    }

    console.log('Successfully processed and stored USDOT info');
    return new Response(
      JSON.stringify(transformedData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in fetch-usdot-info function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Please make sure you entered a valid DOT number. If the problem persists, contact support.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
