
import { corsHeaders } from '../_shared/cors.ts';

const CARRIER_OK_API_URL = 'https://carrier-okay-6um2cw59.uc.gateway.dev/api/v2/profile-lite';

interface RequestData {
  dotNumber: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData: RequestData = await req.json();
    const { dotNumber } = requestData;

    if (!dotNumber) {
      return new Response(
        JSON.stringify({ error: 'DOT number is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('Fetching data for DOT:', dotNumber);
    
    // Get the API key from environment variable
    const apiKey = Deno.env.get('CARRIER_OK_API_KEY');
    if (!apiKey) {
      throw new Error('CARRIER_OK_API_KEY not configured');
    }

    // Make request to CarrierOK API with proper formatting
    const response = await fetch(`${CARRIER_OK_API_URL}/${dotNumber}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json'
      }
    });

    console.log('CarrierOK API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CarrierOK API error response:', errorText);
      
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ error: 'DOT number not found' }),
          { status: 404, headers: corsHeaders }
        );
      }
      
      throw new Error(`CarrierOK API error: ${errorText || response.status}`);
    }

    const data = await response.json();
    console.log('CarrierOK API response data:', JSON.stringify(data));

    if (!data.items?.[0]) {
      return new Response(
        JSON.stringify({ error: 'No data found for this DOT number' }),
        { status: 404, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error in fetch-usdot-info:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch USDOT information',
        details: error.message
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
