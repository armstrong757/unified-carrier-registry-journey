
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CarrierResponse {
  items: Array<{
    dot_number: string;
    legal_name: string;
    dba_name?: string;
    usdot_status: string;
    entity_type_desc: string;
    total_power_units: string;
    total_drivers: string;
    physical_address: string;
    telephone_number: string;
    company_contact_primary?: string;
    insurance_bipd_on_file: string;
    insurance_bond_on_file: string;
    insurance_cargo_on_file: string;
    risk_score: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { dotNumber, requestSource = 'unknown' } = body;
    
    if (!dotNumber) {
      throw new Error('DOT number is required');
    }

    const apiKey = Deno.env.get('CARRIER_OK_API_KEY');
    if (!apiKey) {
      throw new Error('CarrierOK API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const startTime = performance.now();

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
      if (cacheAge < 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
        // Log the API request with cache hit
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

    // If no cache hit, fetch from CarrierOK API
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

    const carrierData: CarrierResponse = await response.json();
    
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
