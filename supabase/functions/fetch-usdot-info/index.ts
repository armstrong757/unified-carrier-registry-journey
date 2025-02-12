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
  console.log('DEBUG: API Key length:', apiKey?.length);
  
  const validDOTNumber = validateDOTNumber(dotNumber);
  const baseUrl = 'https://api.fmcsa.dot.gov/snapshot/carriers';
  
  // Try different API endpoint formats
  const endpoints = [
    {
      url: `${baseUrl}/${validDOTNumber}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-API-Key': apiKey
      }
    },
    {
      url: `${baseUrl}/${validDOTNumber}?webKey=${apiKey}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  ];

  let lastError = null;
  
  // Try each endpoint configuration
  for (const endpoint of endpoints) {
    try {
      console.log('DEBUG: Trying endpoint:', endpoint.url);
      const response = await fetch(endpoint.url, { headers: endpoint.headers });
      console.log('DEBUG: Response status:', response.status);
      
      const responseText = await response.text();
      console.log('DEBUG: Raw response:', responseText);
      
      if (!response.ok) {
        console.error('DEBUG: Response not OK. Status:', response.status);
        lastError = new Error(`HTTP error! status: ${response.status}`);
        continue;
      }

      try {
        const data = JSON.parse(responseText);
        if (!data || !data.content) {
          console.error('DEBUG: Invalid data structure:', JSON.stringify(data));
          lastError = new Error('Invalid API response structure');
          continue;
        }

        const carrierData = data.content;
        return {
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
          basicsData: {},
        };
      } catch (parseError) {
        console.error('DEBUG: Failed to parse JSON:', parseError);
        lastError = parseError;
      }
    } catch (fetchError) {
      console.error('DEBUG: Fetch error:', fetchError);
      lastError = fetchError;
    }
  }

  // If we get here, all attempts failed
  throw lastError || new Error('Failed to fetch carrier data');
}

async function fetchBasicsData(dotNumber: string, apiKey: string): Promise<any> {
  try {
    const url = `https://api.fmcsa.dot.gov/safety/carriers/${dotNumber}/basics?webKey=${apiKey}`;
    console.log('DEBUG: Fetching BASIC data from:', url);
    
    const response = await fetch(url);
    console.log('DEBUG: BASIC data response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('DEBUG: No BASIC data available');
        return null;
      }
      const errorText = await response.text();
      throw new Error(`BASIC data fetch failed (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    return data.content || null;
  } catch (error) {
    console.error('DEBUG: Error fetching BASIC data:', error);
    return null;
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
    const basicsData = await fetchBasicsData(dotNumber, fmcsaApiKey);

    const finalData = {
      ...carrierData,
      basicsData: basicsData || {},
    };

    // Cache the data
    console.log('DEBUG: Caching new data');
    const { error: insertError } = await supabase.from('usdot_info').insert({
      usdot_number: finalData.usdotNumber,
      operating_status: finalData.operatingStatus,
      entity_type: finalData.entityType,
      legal_name: finalData.legalName,
      dba_name: finalData.dbaName,
      physical_address: finalData.physicalAddress,
      telephone: finalData.telephone,
      power_units: finalData.powerUnits,
      bus_count: finalData.busCount,
      limo_count: finalData.limoCount,
      minibus_count: finalData.minibusCount,
      motorcoach_count: finalData.motorcoachCount,
      van_count: finalData.vanCount,
      complaint_count: finalData.complaintCount,
      out_of_service: finalData.outOfService,
      out_of_service_date: finalData.outOfServiceDate,
      mc_number: finalData.mcNumber,
      mcs150_last_update: finalData.mcs150LastUpdate,
      basics_data: finalData.basicsData,
    });

    if (insertError) {
      console.error('DEBUG: Cache insert error:', insertError);
    }

    return new Response(
      JSON.stringify(finalData),
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
