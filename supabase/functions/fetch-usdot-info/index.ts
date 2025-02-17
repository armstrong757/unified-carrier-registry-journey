
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { corsHeaders } from '../_shared/cors.ts'

interface RequestData {
  dotNumber: string;
  testMode?: boolean;
  requestSource?: string;
}

const CARRIER_OK_API_KEY = Deno.env.get('CARRIER_OK_API_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { dotNumber, testMode, requestSource } = await req.json() as RequestData

    // Validate input
    if (!dotNumber) {
      throw new Error('DOT number is required')
    }

    // Log the request
    console.log(`Fetching DOT info for ${dotNumber} from ${requestSource || 'unknown source'}`)

    // Call the CarrierOK API
    const response = await fetch(
      `https://carrier-okay-6um2cw59.uc.gateway.dev/api/v2/profile-lite?dot=${dotNumber}`,
      {
        method: 'GET',
        headers: {
          'X-Api-Key': CARRIER_OK_API_KEY || '',
        },
      }
    )

    // Log API response status
    console.log(`CarrierOK API Response Status: ${response.status}\n`)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.items || !data.items[0]) {
      throw new Error('No data found for the provided DOT number')
    }

    const carrier = data.items[0]

    // Transform the data to match our application's schema
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
      mcs150_form_date: carrier.mcs150_last_update, // Changed to use full date field
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
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
