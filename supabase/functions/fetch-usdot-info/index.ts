
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { validateDOTNumber } from './validator.ts'
import { getCarrierOKProfile } from './api-client.ts'
import { getCachedResponse, cacheResponse } from './cache-manager.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { dotNumber, requestSource = 'unknown' } = await req.json()

    if (!dotNumber) {
      throw new Error('DOT number is required')
    }

    const cleanDotNumber = dotNumber.toString().trim()
    
    if (!validateDOTNumber(cleanDotNumber)) {
      throw new Error('Invalid DOT number format')
    }

    console.log(`Making request to CarrierOK API for DOT number: ${cleanDotNumber}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const startTime = Date.now()

    // Check cache
    const cachedData = await getCachedResponse(supabase, cleanDotNumber)
    if (cachedData) {
      console.log('Using cached USDOT data:', cachedData)
      
      await supabase.from('api_requests').insert({
        usdot_number: cleanDotNumber,
        request_type: 'carrier_profile',
        request_source: requestSource,
        cache_hit: true,
        response_status: 200,
        response_time_ms: Date.now() - startTime
      })

      return new Response(JSON.stringify(cachedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Fetch from API
    const apiResponse = await getCarrierOKProfile(cleanDotNumber)
    console.log('Received API response:', apiResponse)

    // Cache the response
    await cacheResponse(supabase, cleanDotNumber, apiResponse)
    
    // Transform for client response
    const clientResponse = {
      usdot_number: apiResponse.items[0].dot_number,
      legal_name: apiResponse.items[0].legal_name,
      dba_name: apiResponse.items[0].dba_name || '',
      operating_status: apiResponse.items[0].usdot_status,
      entity_type: apiResponse.items[0].entity_type_desc,
      physical_address: apiResponse.items[0].physical_address,
      telephone: apiResponse.items[0].telephone_number?.toString(),
      power_units: apiResponse.items[0].total_power_units,
      drivers: apiResponse.items[0].total_drivers,
      insurance_bipd: apiResponse.items[0].insurance_bipd_on_file,
      insurance_bond: apiResponse.items[0].insurance_bond_on_file,
      insurance_cargo: apiResponse.items[0].insurance_cargo_on_file,
      risk_score: apiResponse.items[0].risk_score,
      mcs150_form_date: apiResponse.items[0].mcs150_last_update,
      mcs150_year: apiResponse.items[0].mcs150_year,
      mcs150_mileage: apiResponse.items[0].mcs150_mileage
    }

    // Log the API request
    await supabase.from('api_requests').insert({
      usdot_number: cleanDotNumber,
      request_type: 'carrier_profile',
      request_source: requestSource,
      cache_hit: false,
      response_status: 200,
      response_time_ms: Date.now() - startTime
    })

    return new Response(JSON.stringify(clientResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in fetch-usdot-info:', error)
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
