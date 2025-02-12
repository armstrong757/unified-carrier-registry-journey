
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
  dbaName: string;
  physicalAddress: string;
  telephone: string;
  powerUnits: number;
  busCount: number;
  limoCount: number;
  minibusCount: number;
  motorcoachCount: number;
  vanCount: number;
  complaintCount: number;
  outOfService: boolean;
  outOfServiceDate: string | null;
  mcNumber: string;
  mcs150LastUpdate: string;
  basicsData: Record<string, any>;
}

async function fetchCarrierData(dotNumber: string, apiKey: string): Promise<any> {
  const response = await fetch(
    `https://mobile.fmcsa.dot.gov/qc/services/carriers/${dotNumber}?webKey=${apiKey}`
  )
  if (!response.ok) {
    throw new Error(`Carrier data fetch failed: ${response.status}`)
  }
  return response.json()
}

async function fetchBasicsData(dotNumber: string, apiKey: string): Promise<any> {
  const response = await fetch(
    `https://mobile.fmcsa.dot.gov/qc/services/carriers/${dotNumber}/basics?webKey=${apiKey}`
  )
  if (!response.ok) {
    // Basics data might not be available for all carriers
    if (response.status === 404) {
      return null
    }
    throw new Error(`Basics data fetch failed: ${response.status}`)
  }
  return response.json()
}

serve(async (req) => {
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
          dbaName: existingData.dba_name,
          physicalAddress: existingData.physical_address,
          telephone: existingData.telephone,
          powerUnits: existingData.power_units,
          busCount: existingData.bus_count,
          limoCount: existingData.limo_count,
          minibusCount: existingData.minibus_count,
          motorcoachCount: existingData.motorcoach_count,
          vanCount: existingData.van_count,
          complaintCount: existingData.complaint_count,
          outOfService: existingData.out_of_service,
          outOfServiceDate: existingData.out_of_service_date,
          mcNumber: existingData.mc_number,
          mcs150LastUpdate: existingData.mcs150_last_update,
          basicsData: existingData.basics_data,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Fetch carrier and BASIC data in parallel
    console.log('Fetching USDOT info from FMCSA API:', dotNumber)
    const [carrierData, basicsData] = await Promise.all([
      fetchCarrierData(dotNumber, fmcsaApiKey),
      fetchBasicsData(dotNumber, fmcsaApiKey).catch(error => {
        console.warn('Failed to fetch BASIC data:', error)
        return null
      })
    ])

    // Transform FMCSA data to our format using the documented field names
    const transformedData: USDOTData = {
      usdotNumber: dotNumber,
      operatingStatus: carrierData.allowToOperate === 'Y' ? 'AUTHORIZED' : 'NOT AUTHORIZED',
      entityType: 'N/A', // Not provided in basic carrier response
      legalName: carrierData.legalName || '',
      dbaName: carrierData.dbaName || '',
      physicalAddress: `${carrierData.phyStreet || ''}, ${carrierData.phyCity || ''}, ${carrierData.phyState || ''} ${carrierData.phyZip || ''}, ${carrierData.phyCountry || ''}`.trim(),
      telephone: carrierData.telephone || '',
      powerUnits: parseInt(carrierData.passengerVehicle) || 0,
      busCount: parseInt(carrierData.busVehicle) || 0,
      limoCount: parseInt(carrierData.limoVehicle) || 0,
      minibusCount: parseInt(carrierData.miniBusVehicle) || 0,
      motorcoachCount: parseInt(carrierData.motorCoachVehicle) || 0,
      vanCount: parseInt(carrierData.vanVehicle) || 0,
      complaintCount: parseInt(carrierData.complaintCount) || 0,
      outOfService: carrierData.outOfService === 'Y',
      outOfServiceDate: carrierData.outOfServiceDate || null,
      mcNumber: carrierData.mcNumber || '',
      mcs150LastUpdate: carrierData.snapShotDate || '',
      basicsData: basicsData || {},
    }

    // Store the data in our database
    const { error: insertError } = await supabase.from('usdot_info').insert({
      usdot_number: transformedData.usdotNumber,
      operating_status: transformedData.operatingStatus,
      entity_type: transformedData.entityType,
      legal_name: transformedData.legalName,
      dba_name: transformedData.dbaName,
      physical_address: transformedData.physicalAddress,
      telephone: transformedData.telephone,
      power_units: transformedData.powerUnits,
      bus_count: transformedData.busCount,
      limo_count: transformedData.limoCount,
      minibus_count: transformedData.minibusCount,
      motorcoach_count: transformedData.motorcoachCount,
      van_count: transformedData.vanCount,
      complaint_count: transformedData.complaintCount,
      out_of_service: transformedData.outOfService,
      out_of_service_date: transformedData.outOfServiceDate,
      mc_number: transformedData.mcNumber,
      mcs150_last_update: transformedData.mcs150LastUpdate,
      basics_data: transformedData.basicsData,
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
