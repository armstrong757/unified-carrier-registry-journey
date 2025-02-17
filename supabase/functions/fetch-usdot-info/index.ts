
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { validateDOTNumber } from './validator.ts'
import { getCarrierOKProfile } from './api-client.ts'
import { getCachedResponse, cacheResponse } from './cache-manager.ts'

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
      requestBody = await req.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      throw new Error('Invalid request body');
    }

    const { dotNumber, requestSource = 'unknown' } = requestBody;

    if (!dotNumber) {
      throw new Error('DOT number is required')
    }

    const cleanDotNumber = dotNumber.toString().trim()
    
    if (!validateDOTNumber(cleanDotNumber)) {
      throw new Error('Invalid DOT number format')
    }

    console.log(`Processing request for DOT number: ${cleanDotNumber}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const startTime = Date.now()

    try {
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

        return new Response(JSON.stringify({ items: [cachedData] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      // Fetch from API
      const apiResponse = await getCarrierOKProfile(cleanDotNumber)
      console.log('Received API response:', apiResponse)

      // Cache the response
      await cacheResponse(supabase, cleanDotNumber, apiResponse)
      
      // Log the API request
      await supabase.from('api_requests').insert({
        usdot_number: cleanDotNumber,
        request_type: 'carrier_profile',
        request_source: requestSource,
        cache_hit: false,
        response_status: 200,
        response_time_ms: Date.now() - startTime
      })

      return new Response(JSON.stringify(apiResponse), {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        },
        status: 200,
      })
    } catch (dbError) {
      console.error('Database operation error:', dbError)
      throw new Error('Database operation failed')
    }

  } catch (error) {
    console.error('Error in fetch-usdot-info:', error)
    
    const errorResponse = {
      error: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      details: error.stack
    };

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.status || 500,
    })
  }
})
