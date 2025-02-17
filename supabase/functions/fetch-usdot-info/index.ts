
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_MINUTES = 5;
const RATE_LIMIT_THRESHOLD = 10;

// Test data for verifying functionality
const TEST_DOT_DATA = {
  usdot_number: "12345",
  legal_name: "TEST CARRIER LLC",
  dba_name: "TEST DBA",
  operating_status: "ACTIVE",
  entity_type: "CARRIER",
  physical_address: "123 TEST ST, TEST CITY, ST 12345",
  telephone: "1234567890",
  power_units: 5,
  drivers: 10,
  insurance_bipd: 750000,
  insurance_bond: 75000,
  insurance_cargo: 100000,
  risk_score: "Low",
  updated_at: new Date().toISOString()
};

async function checkRateLimit(supabase: any, dotNumber: string): Promise<boolean> {
  const { data: abuseData } = await supabase.rpc('check_api_abuse', {
    p_minutes: RATE_LIMIT_MINUTES,
    p_threshold: RATE_LIMIT_THRESHOLD
  });
  
  return abuseData?.some((item: any) => item.usdot_number === dotNumber) || false;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { dotNumber, requestSource = 'unknown', testMode = false } = body;
    
    if (!dotNumber) {
      throw new Error('DOT number is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const startTime = performance.now();

    // Check rate limit before proceeding
    const isRateLimited = await checkRateLimit(supabase, dotNumber);
    if (isRateLimited) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // First check cache
    const { data: cachedData, error: cacheError } = await supabase
      .from('usdot_info')
      .select('*')
      .eq('usdot_number', dotNumber)
      .single();

    if (cacheError && cacheError.code !== 'PGRST116') {
      console.error('Cache lookup error:', cacheError);
    }

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    // If we have valid cached data less than 24 hours old
    if (cachedData && cachedData.updated_at) {
      const cacheAge = Date.now() - new Date(cachedData.updated_at).getTime();
      if (cacheAge < 24 * 60 * 60 * 1000) {
        await supabase.from('api_requests').insert({
          usdot_number: dotNumber,
          request_type: 'carrier_data',
          request_source: requestSource,
          cache_hit: true,
          response_time_ms: responseTime,
          response_status: 200
        });

        return new Response(
          JSON.stringify(cachedData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // If in test mode, return test data
    if (testMode) {
      console.log('Test mode: Returning test data for DOT:', dotNumber);
      const testResponse = { ...TEST_DOT_DATA, usdot_number: dotNumber };
      
      await supabase.from('api_requests').insert({
        usdot_number: dotNumber,
        request_type: 'carrier_data',
        request_source: `${requestSource}_test`,
        cache_hit: false,
        response_time_ms: responseTime,
        response_status: 200
      });

      return new Response(
        JSON.stringify(testResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if CarrierOK API key is configured
    const apiKey = Deno.env.get('CARRIER_OK_API_KEY');
    if (!apiKey) {
      throw new Error('CarrierOK API key not configured. Using test mode for verification.');
    }

    console.log('Fetching from CarrierOK API for DOT:', dotNumber);
    const apiUrl = `https://carrier-okay-6um2cw59.uc.gateway.dev/api/v2/profile-lite?dot=${dotNumber}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`CarrierOK API error: ${response.status} ${response.statusText}`);
    }

    const carrierData = await response.json();
    
    if (!carrierData.items?.[0]) {
      throw new Error('No carrier data found');
    }

    const carrier = carrierData.items[0];
    const mappedData = {
      usdot_number: carrier.dot_number,
      legal_name: carrier.legal_name,
      dba_name: carrier.dba_name || null,
      operating_status: carrier.usdot_status,
      entity_type: carrier.entity_type_desc,
      physical_address: carrier.physical_address,
      telephone: carrier.telephone_number,
      power_units: parseInt(carrier.total_power_units) || 0,
      drivers: parseInt(carrier.total_drivers) || 0,
      insurance_bipd: parseInt(carrier.insurance_bipd_on_file) || 0,
      insurance_bond: parseInt(carrier.insurance_bond_on_file) || 0,
      insurance_cargo: parseInt(carrier.insurance_cargo_on_file) || 0,
      risk_score: carrier.risk_score,
      updated_at: new Date().toISOString()
    };

    // Update cache
    const { error: upsertError } = await supabase
      .from('usdot_info')
      .upsert(mappedData);

    if (upsertError) {
      console.error('Cache update error:', upsertError);
    }

    // Log the API request
    await supabase.from('api_requests').insert({
      usdot_number: dotNumber,
      request_type: 'carrier_data',
      request_source: requestSource,
      cache_hit: false,
      response_time_ms: responseTime,
      request_url: apiUrl,
      response_status: response.status
    });

    return new Response(
      JSON.stringify(mappedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Log the error
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    await supabase.from('api_requests').insert({
      usdot_number: null,
      request_type: 'carrier_data',
      cache_hit: false,
      response_status: 500,
      error_message: errorMessage
    });

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: 'Failed to fetch carrier data. Please verify your DOT number and try again.',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
