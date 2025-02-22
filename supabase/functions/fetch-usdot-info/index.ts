
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { fetchAndValidateData } from "./api-client.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('CARRIER_OK_API_KEY');
    if (!apiKey) {
      throw new Error('CARRIER_OK_API_KEY environment variable is not set');
    }

    // Parse request body
    const { dotNumber } = await req.json();
    if (!dotNumber) {
      throw new Error('DOT number is required');
    }

    console.log('Fetching data for DOT:', dotNumber);

    const response = await fetch(
      `https://carrier-okay-6um2cw59.uc.gateway.dev/api/v2/profile?dot=${dotNumber}`,
      {
        method: 'GET',
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('CarrierOK API error:', response.status, await response.text());
      throw new Error(`CarrierOK API returned status ${response.status}`);
    }

    const data = await response.json();
    console.log('CarrierOK API parsed response:', JSON.stringify(data, null, 2));

    // Validate and clean the response
    const validatedData = await fetchAndValidateData(data);

    return new Response(JSON.stringify(validatedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-usdot-info:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to fetch USDOT information'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
