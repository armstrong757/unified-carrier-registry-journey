
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
  console.log('DEBUG: API Key first 4 chars:', apiKey?.substring(0, 4));
  
  const validDOTNumber = validateDOTNumber(dotNumber);
  
  // Test a different endpoint format
  const url = `https://api.fmcsa.dot.gov/snapshot/carriers/${validDOTNumber}`;
  console.log('DEBUG: Making request to:', url);
  
  try {
    if (!apiKey || apiKey.length < 32) {
      console.error('DEBUG: Invalid API key length:', apiKey?.length);
      throw new Error('Invalid API key format');
    }

    // First try without the webKey in the URL
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-API-Key': apiKey
      }
    });
    
    console.log('DEBUG: Initial response status:', response.status);
    console.log('DEBUG: Response headers:', JSON.stringify(Array.from(response.headers.entries())));
    
    const responseText = await response.text();
    console.log('DEBUG: Raw response:', responseText);
    console.log('DEBUG: Response content type:', response.headers.get('content-type'));

    if (!response.ok) {
      console.error('DEBUG: Response not OK. Status:', response.status);
      console.error('DEBUG: Response status text:', response.statusText);
      
      if (response.status === 403) {
        console.error('DEBUG: 403 Forbidden - likely an API key issue');
        throw new Error('API access forbidden - please check API key permissions');
      }
      
      // Try alternative URL format with webKey as query param
      console.log('DEBUG: Trying alternative URL format...');
      const altResponse = await fetch(`${url}?webKey=${apiKey}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('DEBUG: Alternative response status:', altResponse.status);
      const altText = await altResponse.text();
      console.log('DEBUG: Alternative raw response:', altText);
      
      if (!altResponse.ok) {
        throw new Error(`Both API request attempts failed. Status: ${response.status}, Alt Status: ${altResponse.status}`);
      }
      
      try {
        return JSON.parse(altText);
      } catch (e) {
        console.error('DEBUG: Failed to parse alternative response:', e);
        throw new Error('Invalid JSON in alternative response');
      }
    }

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('DEBUG: Successfully parsed JSON response');
    } catch (e) {
      console.error('DEBUG: Failed to parse JSON:', e);
      console.error('DEBUG: Raw text that failed to parse:', responseText);
      throw new Error('Invalid JSON response from FMCSA API');
    }

    if (!data || !data.content) {
      console.error('DEBUG: Missing expected data structure:', JSON.stringify(data));
      throw new Error('Empty or invalid response from FMCSA API');
    }

    console.log('DEBUG: API Response Structure:', JSON.stringify(data, null, 2));

    const carrierData = data.content;
    const mappedData = {
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

    console.log('DEBUG: Final mapped data:', JSON.stringify(mappedData, null, 2));
    return mappedData;
  } catch (error) {
    console.error('DEBUG: API request failed:', error);
    console.error('DEBUG: Error stack:', error.stack);
    throw error;
  }
}

async function fetchBasicsData(dotNumber: string, apiKey: string): Promise<any> {
  console.log('Fetching BASIC data for DOT number:', dotNumber);
  
  try {
    const response = await fetch(
      `https://api.fmcsa.dot.gov/safety/carriers/${dotNumber}/basics?webKey=${apiKey}`
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
    console.log('BASIC data response:', JSON.stringify(data, null, 2));
    
    if (!data || !data.content) {
      console.log('No BASIC data returned from FMCSA API');
      return null;
    }
    
    return data.content;
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
    
    console.log('DEBUG: Received request for DOT number:', dotNumber);
    
    if (!dotNumber) {
      throw new Error('DOT number is required');
    }

    const fmcsaApiKey = Deno.env.get('FMCSA_API_KEY');
    if (!fmcsaApiKey) {
      throw new Error('FMCSA API key not configured');
    }

    console.log('DEBUG: API Key present:', !!fmcsaApiKey);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First try to get from cache
    const { data: existingData, error: fetchError } = await supabase
      .from('usdot_info')
      .select('*')
      .eq('usdot_number', dotNumber)
      .maybeSingle();

    if (fetchError) {
      console.error('Database fetch error:', fetchError);
      throw fetchError;
    }

    if (existingData) {
      console.log('Found cached data for DOT:', dotNumber);
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

    // If we get here, we need to fetch new data
    console.log('Fetching fresh data from FMCSA API');
    const carrierData = await fetchCarrierData(dotNumber, fmcsaApiKey);
    const basicsData = await fetchBasicsData(dotNumber, fmcsaApiKey);

    const transformedData = {
      ...carrierData,
      basicsData: basicsData || {},
    };

    // Store in cache
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
      console.error('Failed to cache data:', insertError);
    }

    return new Response(
      JSON.stringify(transformedData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Function error:', error);
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
