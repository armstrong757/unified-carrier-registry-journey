
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'
import { validateDOTNumber } from './validator.ts'
import { USDOTResponse } from './types.ts'
import { getCarrierOKProfile } from './api-client.ts'
import { getCachedResponse, cacheResponse } from './cache-manager.ts'

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const requestData = await req.json();
    console.log('Received request data:', requestData);

    const { dotNumber, requestSource = 'unknown' } = requestData;
    
    if (!dotNumber) {
      throw new Error('DOT number is required');
    }

    // Ensure dotNumber is a string and trim any whitespace
    const cleanDotNumber = dotNumber.toString().trim();
    console.log('Cleaned DOT number:', cleanDotNumber);

    // Validate input
    if (!validateDOTNumber(cleanDotNumber)) {
      throw new Error('Invalid DOT number format');
    }

    const startTime = Date.now();
    console.log(`Processing request for DOT ${cleanDotNumber} from source: ${requestSource}`);

    // Check cache first
    const cachedData = await getCachedResponse(supabase, cleanDotNumber);
    if (cachedData) {
      console.log('Cache hit for DOT:', cleanDotNumber);
      
      await supabase.from('api_requests').insert({
        usdot_number: cleanDotNumber,
        request_type: 'carrier_profile',
        request_source: requestSource,
        cache_hit: true,
        response_status: 200,
        response_time_ms: Date.now() - startTime
      });

      return new Response(JSON.stringify(cachedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    console.log('Cache miss, fetching from CarrierOK API for DOT:', cleanDotNumber);
    
    // Fetch from API
    const response = await getCarrierOKProfile(cleanDotNumber);
    
    if (!response) {
      throw new Error('No data received from CarrierOK API');
    }

    // Cache the response
    await cacheResponse(supabase, cleanDotNumber, response);

    // Log the API request
    await supabase.from('api_requests').insert({
      usdot_number: cleanDotNumber,
      request_type: 'carrier_profile',
      request_source: requestSource,
      cache_hit: false,
      response_status: 200,
      response_time_ms: Date.now() - startTime
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in fetch-usdot-info:', error);

    // Log the failed request
    try {
      const { dotNumber, requestSource = 'unknown' } = await req.json();
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      await supabase.from('api_requests').insert({
        usdot_number: dotNumber?.toString() || 'unknown',
        request_type: 'carrier_profile',
        request_source: requestSource,
        cache_hit: false,
        response_status: 500,
        error_message: error.message
      });
    } catch (logError) {
      console.error('Error logging failed request:', logError);
    }

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
