
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
  console.log('DEBUG: Starting carrier data fetch for DOT number:', dotNumber);
  
  const validDOTNumber = validateDOTNumber(dotNumber);
  const baseUrl = 'https://mobile.fmcsa.dot.gov/qc/services/carriers';
  const url = `${baseUrl}/${validDOTNumber}?webKey=${apiKey}`;
  
  try {
    console.log('DEBUG: Fetching from URL:', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('DEBUG: Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DEBUG: Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('DEBUG: Raw response:', responseText);

    if (!responseText) {
      throw new Error('Empty response from FMCSA API');
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('DEBUG: JSON parse error:', parseError);
      throw new Error('Failed to parse FMCSA API response');
    }

    if (!data) {
      throw new Error('Invalid API response structure');
    }

    console.log('DEBUG: Parsed response data:', data);

    // Map the API response to our interface with improved error handling
    const result = {
      usdotNumber: validDOTNumber,
      operatingStatus: data.content?.allowedToOperate === 'N' ? 'NOT AUTHORIZED' : 'AUTHORIZED',
      entityType: data.content?.operatingStatus || 'UNKNOWN',
      legalName: data.content?.legalName || 'NOT PROVIDED',
      dbaName: data.content?.dbaName || '',
      physicalAddress: [
        data.content?.physicalAddress,
        data.content?.physicalCity,
        data.content?.physicalState,
        data.content?.physicalZipcode
      ].filter(Boolean).join(', ') || 'NOT PROVIDED',
      telephone: data.content?.phoneNumber || 'NOT PROVIDED',
      powerUnits: parseInt(data.content?.totalPowerUnits) || 0,
      busCount: parseInt(data.content?.totalBuses) || 0,
      limoCount: parseInt(data.content?.totalLimousines) || 0,
      minibusCount: parseInt(data.content?.totalMiniBuses) || 0,
      motorcoachCount: parseInt(data.content?.totalMotorCoaches) || 0,
      vanCount: parseInt(data.content?.totalVans) || 0,
      complaintCount: parseInt(data.content?.totalComplaints) || 0,
      outOfService: data.content?.oosStatus === 'Y',
      outOfServiceDate: data.content?.oosDate || null,
      mcNumber: data.content?.mcNumber || '',
      mcs150LastUpdate: data.content?.mcs150FormDate || null,
      basicsData: {},
    };

    console.log('DEBUG: Mapped response data:', result);
    return result;

  } catch (error) {
    console.error('DEBUG: Error fetching carrier data:', error);
    throw error;
  }
}

serve(async (req) => {
  console.log('DEBUG: Received request method:', req.method);
  console.log('DEBUG: Request headers:', Object.fromEntries(req.headers.entries()));

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('DEBUG: Request body:', body);
    
    const { dotNumber } = body;
    if (!dotNumber) {
      throw new Error('DOT number is required');
    }

    const fmcsaApiKey = Deno.env.get('FMCSA_API_KEY');
    console.log('DEBUG: API Key present:', !!fmcsaApiKey);
    
    if (!fmcsaApiKey) {
      throw new Error('FMCSA API key not configured');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache first
    console.log('DEBUG: Checking cache for DOT:', dotNumber);
    const { data: existingData, error: fetchError } = await supabase
      .from('usdot_info')
      .select('*')
      .eq('usdot_number', dotNumber)
      .maybeSingle();

    if (fetchError) {
      console.error('DEBUG: Cache fetch error:', fetchError);
      throw fetchError;
    }

    if (existingData) {
      console.log('DEBUG: Found cached data');
      return new Response(
        JSON.stringify({
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
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch fresh data
    console.log('DEBUG: Fetching fresh data');
    const carrierData = await fetchCarrierData(dotNumber, fmcsaApiKey);

    // Cache the data
    console.log('DEBUG: Caching new data');
    const { error: insertError } = await supabase.from('usdot_info').insert({
      usdot_number: carrierData.usdotNumber,
      operating_status: carrierData.operatingStatus,
      entity_type: carrierData.entityType,
      legal_name: carrierData.legalName,
      dba_name: carrierData.dbaName,
      physical_address: carrierData.physicalAddress,
      telephone: carrierData.telephone,
      power_units: carrierData.powerUnits,
      bus_count: carrierData.busCount,
      limo_count: carrierData.limoCount,
      minibus_count: carrierData.minibusCount,
      motorcoach_count: carrierData.motorcoachCount,
      van_count: carrierData.vanCount,
      complaint_count: carrierData.complaintCount,
      out_of_service: carrierData.outOfService,
      out_of_service_date: carrierData.outOfServiceDate,
      mc_number: carrierData.mcNumber,
      mcs150_last_update: carrierData.mcs150LastUpdate,
      basics_data: carrierData.basicsData,
    });

    if (insertError) {
      console.error('DEBUG: Cache insert error:', insertError);
    }

    return new Response(
      JSON.stringify(carrierData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('DEBUG: Function error:', error);
    console.error('DEBUG: Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Failed to fetch carrier data. Please verify your DOT number and try again.',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
