
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

function validateDOTNumber(dotNumber: string): boolean {
  // Clean the DOT number by removing any non-digit characters
  const cleanDotNumber = dotNumber.replace(/\D/g, '');
  // DOT numbers are typically 5-7 digits
  return /^\d{5,7}$/.test(cleanDotNumber);
}

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

    const { dotNumber } = requestBody;

    if (!dotNumber) {
      throw new Error('DOT number is required');
    }

    const cleanDotNumber = dotNumber.toString().trim();
    
    if (!validateDOTNumber(cleanDotNumber)) {
      throw new Error('Invalid DOT number format. Must be 5-7 digits.');
    }

    console.log('Processing DOT number:', cleanDotNumber);

    // Fetch carrier data from CarrierOK API
    const apiKey = Deno.env.get('CARRIER_OK_API_KEY');
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    // Changed 'dot' to 'dot_number' in the URL parameter
    const apiUrl = `https://carrier-okay-6um2cw59.uc.gateway.dev/api/v2/profile-lite?dot_number=${encodeURIComponent(cleanDotNumber)}`;
    console.log('Making request to CarrierOK API...');

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();
    console.log('CarrierOK API raw response:', responseText);

    if (!response.ok) {
      throw new Error(`CarrierOK API error: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('CarrierOK API parsed response:', data);
    } catch (e) {
      console.error('Error parsing API response:', e);
      throw new Error('Invalid response from CarrierOK API');
    }

    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid API response format');
    }

    if (data.items.length === 0) {
      throw new Error(`No carrier found with DOT number ${cleanDotNumber}`);
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
