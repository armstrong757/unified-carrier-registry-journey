
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface USDOTData {
  usdotNumber: string;
  operatingStatus: string;
  entityType: string;
  legalName: string;
  physicalAddress: string;
  powerUnits: number;
  drivers: number;
  mcs150LastUpdate: string;
  ein: string;
  mileageYear: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { dotNumber } = await req.json()
    const fmcsaApiKey = Deno.env.get('FMCSA_API_KEY')

    if (!fmcsaApiKey) {
      throw new Error('FMCSA API key not configured')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if we already have this DOT number in our database
    const { data: existingData } = await supabase
      .from('usdot_info')
      .select('*')
      .eq('usdot_number', dotNumber)
      .single()

    if (existingData) {
      console.log('Found existing USDOT info:', dotNumber)
      return new Response(
        JSON.stringify({
          usdotNumber: existingData.usdot_number,
          operatingStatus: existingData.operating_status,
          entityType: existingData.entity_type,
          legalName: existingData.legal_name,
          physicalAddress: existingData.physical_address,
          powerUnits: existingData.power_units,
          drivers: existingData.drivers,
          mcs150LastUpdate: existingData.mcs150_last_update,
          ein: existingData.ein,
          mileageYear: existingData.mileage_year,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // If not in database, fetch from FMCSA API
    console.log('Fetching USDOT info from FMCSA API:', dotNumber)
    const fmcsaResponse = await fetch(
      `https://mobile.fmcsa.dot.gov/qc/services/carriers/${dotNumber}?webKey=${fmcsaApiKey}`
    )

    if (!fmcsaResponse.ok) {
      const errorText = await fmcsaResponse.text()
      console.error('FMCSA API error response:', errorText)
      
      if (fmcsaResponse.status === 401) {
        throw new Error('FMCSA API authentication failed. Please check the API key.')
      } else if (fmcsaResponse.status === 404) {
        throw new Error('USDOT number not found')
      } else {
        throw new Error(`FMCSA API error: ${fmcsaResponse.status} ${fmcsaResponse.statusText}`)
      }
    }

    const fmcsaData = await fmcsaResponse.json()
    
    // Transform FMCSA data to our format using the documented field names
    const transformedData: USDOTData = {
      usdotNumber: dotNumber,
      operatingStatus: fmcsaData.allowToOperate === 'Y' ? 'AUTHORIZED' : 'NOT AUTHORIZED',
      entityType: 'N/A', // Not provided in basic carrier response
      legalName: fmcsaData.legalName || '',
      physicalAddress: `${fmcsaData.phyStreet || ''}, ${fmcsaData.phyCity || ''}, ${fmcsaData.phyState || ''} ${fmcsaData.phyZip || ''}, ${fmcsaData.phyCountry || ''}`.trim(),
      powerUnits: parseInt(fmcsaData.passengerVehicle) || 0,
      drivers: 0, // Not provided in basic carrier response
      mcs150LastUpdate: fmcsaData.snapShotDate || '',
      ein: '', // Not provided in basic carrier response
      mileageYear: '', // Not provided in basic carrier response
    }

    // Store the data in our database
    const { error: insertError } = await supabase.from('usdot_info').insert({
      usdot_number: transformedData.usdotNumber,
      operating_status: transformedData.operatingStatus,
      entity_type: transformedData.entityType,
      legal_name: transformedData.legalName,
      physical_address: transformedData.physicalAddress,
      power_units: transformedData.powerUnits,
      drivers: transformedData.drivers,
      mcs150_last_update: transformedData.mcs150LastUpdate,
      ein: transformedData.ein,
      mileage_year: transformedData.mileageYear,
    })

    if (insertError) {
      console.error('Error storing USDOT info:', insertError)
      throw insertError
    }

    return new Response(
      JSON.stringify(transformedData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in fetch-usdot-info function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
