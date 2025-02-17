
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  try {
    // Ensure the request is a POST
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    let requestBody;
    try {
      const text = await req.text();
      console.log('Raw request body:', text);
      
      if (!text) {
        throw new Error('Empty request body');
      }
      
      requestBody = JSON.parse(text);
      console.log('Parsed request body:', requestBody);
    } catch (e) {
      console.error('Error parsing request body:', e);
      throw new Error(`Invalid request body: ${e.message}`);
    }

    const { dotNumber, requestSource = 'unknown' } = requestBody;

    if (!dotNumber) {
      throw new Error('DOT number is required');
    }

    const cleanDotNumber = dotNumber.toString().trim();
    console.log('Processing DOT number:', cleanDotNumber);

    // Fetch carrier data from CarrierOK API
    const apiKey = Deno.env.get('CARRIER_OK_API_KEY');
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const apiUrl = `https://carrier-okay-6um2cw59.uc.gateway.dev/api/v2/profile-lite?dot=${cleanDotNumber}`;
    console.log('Making request to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CarrierOK API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('CarrierOK API Response:', data);

    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid API response format');
    }

    return new Response(JSON.stringify(data), {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200,
    });

  } catch (error) {
    console.error('Error in fetch-usdot-info:', error);
    
    const errorResponse = {
      error: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      details: error.stack,
    };

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.status || 500,
    });
  }
});
