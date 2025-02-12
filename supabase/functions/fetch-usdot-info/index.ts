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
  
  const url = `https://mobile.fmcsa.dot.gov/qc/services/carriers/${validDOTNumber}?webKey=${apiKey}`;
  console.log('DEBUG: Making request to:', url);
  
  try {
    // Test the API key first
    if (!apiKey || apiKey.length < 32) {
      throw new Error('Invalid API key format');
    }

    const response = await fetch(url);
    console.log('DEBUG: Response status:', response.status);
    
    const responseText = await response.text();
    console.log('DEBUG: Raw response:', responseText);

    // Enhanced error checking
    if (responseText.includes('Invalid request')) {
      throw new Error('Invalid request to FMCSA API');
    }

    if (responseText.includes('Rate limit exceeded')) {
      throw new Error('FMCSA API rate limit exceeded');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON:', responseText);
      throw new Error('Invalid JSON response from FMCSA API');
    }

    if (!data) {
      throw new Error('Empty response from FMCSA API');
    }

    // Log the exact structure we received
    console.log('DEBUG: API Response Structure:', JSON.stringify(data, null, 2));

    // Map the data, with more defensive coding
    const mappedData = {
      usdotNumber: validDOTNumber,
      operatingStatus: data.carrier?.allowToOperate === 'N' ? 'NOT AUTHORIZED' : 'AUTHORIZED',
      entityType: data.carrier?.carrierOperation || 'UNKNOWN',
      legalName: data.carrier?.legalName || 'NOT PROVIDED',
      dbaName: data.carrier?.dbaName || '',
      physicalAddress: [
        data.carrier?.phyStreet,
        data.carrier?.phyCity,
        data.carrier?.phyState,
        data.carrier?.phyZipCode
      ].filter(Boolean).join(', ') || 'NOT PROVIDED',
      telephone: data.carrier?.telephone || 'NOT PROVIDED',
      powerUnits: parseInt(data.carrier?.totalPowerUnits) || 0,
      busCount: parseInt(data.carrier?.busTotal) || 0,
      limoCount: parseInt(data.carrier?.limousineTotal) || 0,
      minibusCount: parseInt(data.carrier?.minibusTotal) || 0,
      motorcoachCount: parseInt(data.carrier?.motorcoachTotal) || 0,
      vanCount: parseInt(data.carrier?.vanTotal) || 0,
      complaintCount: parseInt(data.carrier?.totalComplaints) || 0,
      outOfService: data.carrier?.oosStatus === 'Y',
      outOfServiceDate: data.carrier?.oosDate || null,
      mcNumber: data.carrier?.mcNumber || '',
      mcs150LastUpdate: data.carrier?.mcs150FormDate || null,
      basicsData: {},
    };

    console.log('DEBUG: Mapped data:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('DEBUG: API request failed:', error);
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
