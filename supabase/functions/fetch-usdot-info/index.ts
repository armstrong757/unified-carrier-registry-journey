
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const CARRIER_OK_BASE_URL = "https://carrier-okay-6um2cw59.uc.gateway.dev/api/v2";

interface RequestBody {
  dotNumber: string;
  requestSource: string;
  testMode?: boolean;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dotNumber, requestSource, testMode = false } = await req.json() as RequestBody;
    const apiKey = Deno.env.get("CARRIER_OK_API_KEY");

    if (!apiKey && !testMode) {
      console.error("CarrierOK API key not configured");
      throw new Error("CarrierOK API key not configured");
    }

    if (testMode) {
      console.log("Using test mode data for DOT:", dotNumber);
      // Return test data
      return new Response(
        JSON.stringify({
          usdot_number: dotNumber,
          legal_name: "TEST CARRIER LLC",
          dba_name: "TEST DBA",
          operating_status: "ACTIVE",
          entity_type: "CARRIER",
          physical_address: "123 TEST ST, TEST CITY, ST 12345",
          telephone: "1234567890",
          power_units: 5,
          drivers: 10,
          insurance_bipd: 750000,
          insurance_bond: 75000,
          insurance_cargo: 100000,
          risk_score: "Low",
          mcs150_last_update: null
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Make the actual API call to CarrierOK
    console.log(`Fetching real data for DOT ${dotNumber} from CarrierOK API with key: ${apiKey?.substring(0, 4)}...`);
    
    // Build the API URL
    const apiUrl = new URL(`${CARRIER_OK_BASE_URL}/profile-lite`);
    apiUrl.searchParams.set('dot', dotNumber);
    
    console.log('Request URL:', apiUrl.toString());
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-Api-Key": apiKey!,
        "Accept": "application/json",
      },
    });

    const responseText = await response.text();
    console.log(`CarrierOK API Response Status: ${response.status}`);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response body:', responseText);

    if (!response.ok) {
      throw new Error(`CarrierOK API error: ${response.status}\nResponse: ${responseText}`);
    }

    const carrierData = JSON.parse(responseText);
    
    if (!carrierData?.items?.[0]) {
      console.log('No carrier data found in response:', carrierData);
      throw new Error("No carrier data found for this DOT number");
    }

    const carrier = carrierData.items[0];
    console.log("Received carrier data:", carrier);

    // Transform the data to match our expected format
    const transformedData = {
      usdot_number: carrier.dot_number,
      legal_name: carrier.legal_name,
      dba_name: carrier.dba_name || "",
      operating_status: carrier.usdot_status,
      entity_type: carrier.entity_type_desc,
      physical_address: carrier.physical_address,
      telephone: carrier.telephone_number?.toString() || "",
      power_units: parseInt(carrier.total_power_units) || 0,
      drivers: parseInt(carrier.total_drivers) || 0,
      insurance_bipd: parseInt(carrier.insurance_bipd_on_file) || 0,
      insurance_bond: parseInt(carrier.insurance_bond_on_file) || 0,
      insurance_cargo: parseInt(carrier.insurance_cargo_on_file) || 0,
      risk_score: carrier.risk_score || "Unknown",
      mcs150_last_update: carrier.mcs150_year ? `${carrier.mcs150_year}` : null
    };

    console.log("Transformed data:", transformedData);

    return new Response(
      JSON.stringify(transformedData),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in fetch-usdot-info:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch DOT information";
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: "Failed to fetch carrier data. Please verify your DOT number and try again."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
