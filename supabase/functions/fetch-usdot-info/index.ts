
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface RequestData {
  dotNumber: string;
  requestSource?: string;
}

const CARRIER_OK_API_KEY = Deno.env.get('CARRIER_OK_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { dotNumber, requestSource } = await req.json() as RequestData

    if (!dotNumber) {
      throw new Error('DOT number is required')
    }

    console.log(`Making request to CarrierOK API for DOT number: ${dotNumber}`);

    const response = await fetch(
      `https://carrier-okay-6um2cw59.uc.gateway.dev/api/v2/profile-lite?dot_number=${dotNumber}`,
      {
        method: 'GET',
        headers: {
          'X-Api-Key': CARRIER_OK_API_KEY || '',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.text();
      console.error('CarrierOK API Error Response:', errorData);
      throw new Error(`CarrierOK API request failed: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json()
    
    if (!data.items || !data.items[0]) {
      throw new Error('No data found for the provided DOT number')
    }

    const carrier = data.items[0]

    const transformedData = {
      usdot_number: carrier.dot_number,
      legal_name: carrier.legal_name,
      dba_name: carrier.dba_name || '',
      operating_status: carrier.usdot_status,
      entity_type: carrier.entity_type_desc,
      physical_address: carrier.physical_address,
      telephone: carrier.telephone_number,
      power_units: carrier.total_power_units,
      drivers: carrier.total_drivers,
      insurance_bipd: carrier.insurance_bipd_on_file,
      insurance_bond: carrier.insurance_bond_on_file,
      insurance_cargo: carrier.insurance_cargo_on_file,
      risk_score: carrier.risk_score,
      mcs150_form_date: carrier.mcs150_last_update || carrier.mcs150_year, // Use mcs150_last_update as primary source
      mcs150_year: carrier.mcs150_year,
      mcs150_mileage: carrier.mcs150_mileage,
    }

    return new Response(
      JSON.stringify(transformedData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Edge Function Error:', error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
