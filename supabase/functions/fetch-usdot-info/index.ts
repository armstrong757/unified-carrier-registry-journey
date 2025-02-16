
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { fetchCarrierData } from './api-client.ts';
import { CacheManager } from './cache-manager.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { dotNumber, requestSource = 'unknown' } = body;
    
    if (!dotNumber) {
      throw new Error('DOT number is required');
    }

    const fmcsaApiKey = Deno.env.get('FMCSA_API_KEY');
    if (!fmcsaApiKey) {
      throw new Error('FMCSA API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const cacheManager = new CacheManager(supabaseUrl, supabaseKey);

    // Log the API request
    await cacheManager.logApiRequest({
      usdotNumber: dotNumber,
      requestType: 'carrier_data',
      requestSource,
      cacheHit: false
    });

    // First check the cache
    const cachedData = await cacheManager.getCachedData(dotNumber);
    if (cachedData) {
      // Update the request record to indicate cache hit
      await cacheManager.updateRequestCacheStatus(dotNumber, true);
      
      console.log('DEBUG: Returning cached data for DOT:', dotNumber);
      return new Response(
        JSON.stringify(cachedData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no cache hit, fetch fresh data
    console.log('DEBUG: Fetching fresh data for DOT:', dotNumber);
    const carrierData = await fetchCarrierData(dotNumber, fmcsaApiKey);
    await cacheManager.updateCache(carrierData);

    return new Response(
      JSON.stringify(carrierData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('DEBUG: Function error:', error);
    
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
