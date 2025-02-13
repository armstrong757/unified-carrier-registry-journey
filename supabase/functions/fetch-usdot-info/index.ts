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
    console.log('DEBUG: Fetching from URL:', url.replace(apiKey, '[REDACTED]'));
    
    // Log pre-fetch state
    console.log('DEBUG: Starting fetch with headers:', {
      'Accept': 'application/json'
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Immediately log response details
    console.log('DEBUG: Initial response received');
    console.log('DEBUG: Response status:', response.status);
    console.log('DEBUG: Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('DEBUG: Raw response length:', responseText.length);
    console.log('DEBUG: First 500 chars of response:', responseText.substring(0, 500));

    if (!response.ok) {
      console.error('DEBUG: Error response status:', response.status);
      console.error('DEBUG: Error response statusText:', response.statusText);
      console.error('DEBUG: Error response body:', responseText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    if (!responseText) {
      console.error('DEBUG: Empty response received');
      throw new Error('Empty response from FMCSA API');
    }

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('DEBUG: Successfully parsed JSON response');
      console.log('DEBUG: Response data structure:', Object.keys(data));
    } catch (parseError) {
      console.error('DEBUG: JSON parse error:', parseError);
      console.error('DEBUG: Invalid JSON received:', responseText);
      throw new Error('Failed to parse FMCSA API response');
    }

    if (!data) {
      console.error('DEBUG: Null data after parsing');
      throw new Error('Invalid API response structure');
    }

    // Try accessing data both with and without content wrapper
    const carrierData = data.content || data;
    console.log('DEBUG: Using data structure:', carrierData ? 'content wrapper' : 'direct data');
    console.log('DEBUG: Available fields:', Object.keys(carrierData));

    const result = {
      usdotNumber: validDOTNumber,
      operatingStatus: carrierData.allowedToOperate === 'N' ? 'NOT AUTHORIZED' : 'AUTHORIZED',
      entityType: carrierData.operatingStatus || 'UNKNOWN',
      legalName: carrierData.legalName || 'NOT PROVIDED',
      dbaName: carrierData.dbaName || '',
      physicalAddress: [
        carrierData.physicalAddress,
        carrierData.physicalCity,
        carrierData.physicalState,
        carrierData.physicalZipcode
      ].filter(Boolean).join(', ') || 'NOT PROVIDED',
      telephone: carrierData.phoneNumber || 'NOT PROVIDED',
      powerUnits: parseInt(carrierData.totalPowerUnits) || 0,
      busCount: parseInt(carrierData.totalBuses) || 0,
      limoCount: parseInt(carrierData.totalLimousines) || 0,
      minibusCount: parseInt(carrierData.totalMiniBuses) || 0,
      motorcoachCount: parseInt(carrierData.totalMotorCoaches) || 0,
      vanCount: parseInt(carrierData.totalVans) || 0,
      complaintCount: parseInt(carrierData.totalComplaints) || 0,
      outOfService: carrierData.oosStatus === 'Y',
      outOfServiceDate: carrierData.oosDate || null,
      mcNumber: carrierData.mcNumber || '',
      mcs150LastUpdate: carrierData.mcs150FormDate || null,
      basicsData: data.basics || {},
    };

    console.log('DEBUG: Mapped final result:', result);
    return result;

  } catch (error) {
    console.error('DEBUG: Error in fetchCarrierData:', error);
    console.error('DEBUG: Error stack:', error.stack);
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
    console.log('DEBUG: API Key length:', fmcsaApiKey?.length || 0);
    
    if (!fmcsaApiKey) {
      throw new Error('FMCSA API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache but with timestamp validation
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

    const now = new Date();
    const cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Log cache expiration details
    if (existingData) {
      const lastUpdate = new Date(existingData.updated_at || '');
      const timeSinceUpdate = now.getTime() - lastUpdate.getTime();
      console.log('DEBUG: Cache details:', {
        lastUpdate: lastUpdate.toISOString(),
        timeSinceUpdate: `${Math.floor(timeSinceUpdate / (1000 * 60))} minutes`,
        cacheExpiry: `${cacheExpiry / (1000 * 60 * 60)} hours`,
        isExpired: timeSinceUpdate > cacheExpiry
      });
    }

    // Force a refresh for testing
    console.log('DEBUG: Forcing fresh API call for testing');
    console.log('DEBUG: Fetching fresh data from FMCSA API');
    const carrierData = await fetchCarrierData(dotNumber, fmcsaApiKey);

    if (existingData) {
      console.log('DEBUG: Updating existing cache entry');
      const { error: updateError } = await supabase
        .from('usdot_info')
        .update({
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
          updated_at: now.toISOString()
        })
        .eq('usdot_number', dotNumber);

      if (updateError) {
        console.error('DEBUG: Cache update error:', updateError);
      }
    } else {
      console.log('DEBUG: Creating new cache entry');
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
