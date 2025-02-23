
import { corsHeaders } from '../_shared/cors.ts';

const CARRIER_OK_API_URL = 'https://carrier-okay-6um2cw59.uc.gateway.dev/api/v2/profile-lite';

interface RequestData {
  dotNumber: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: RequestData = await req.json();
    const { dotNumber } = requestData;

    if (!dotNumber) {
      return new Response(
        JSON.stringify({ error: 'DOT number is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const apiKey = Deno.env.get('CARRIER_OK_API_KEY');
    if (!apiKey) {
      throw new Error('CARRIER_OK_API_KEY not configured');
    }

    // Correctly format the URL with query parameter
    const url = `${CARRIER_OK_API_URL}?dot=${dotNumber}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ error: 'DOT number not found' }),
          { status: 404, headers: corsHeaders }
        );
      }
      return new Response(
        JSON.stringify({ error: 'Failed to fetch from CarrierOK API' }),
        { status: response.status, headers: corsHeaders }
      );
    }

    const data = await response.json();
    return new Response(
      JSON.stringify(data),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
