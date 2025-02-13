
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
    const { dotNumber } = body;
    
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

    // Force fresh data fetch for now
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

