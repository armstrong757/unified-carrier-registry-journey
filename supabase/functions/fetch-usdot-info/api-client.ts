
import { USDOTResponse } from './types.ts';

export async function getCarrierOKProfile(dotNumber: string): Promise<USDOTResponse> {
  const apiKey = Deno.env.get('CARRIER_OK_API_KEY');
  if (!apiKey) {
    throw new Error('CarrierOK API key not configured');
  }

  const baseUrl = 'https://carrier-okay-6um2cw59.uc.gateway.dev/api/v2';
  const url = `${baseUrl}/profile-lite?dot=${encodeURIComponent(dotNumber)}`;

  console.log('Making request to CarrierOK API:', {
    url,
    dotNumber,
    hasApiKey: !!apiKey
  });

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log('Raw API Response:', responseText);

    if (!response.ok) {
      console.error('CarrierOK API error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText
      });
      throw new Error(`CarrierOK API error: ${response.status} ${response.statusText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse API response:', e);
      throw new Error('Invalid JSON response from API');
    }

    console.log('Parsed API response:', data);

    if (!data.items || !data.items[0]) {
      throw new Error('No data found for DOT number');
    }

    const item = data.items[0];
    
    return {
      usdot_number: item.dot_number || dotNumber,
      legal_name: item.legal_name || '',
      dba_name: item.dba_name || '',
      operating_status: item.usdot_status || 'NOT AUTHORIZED',
      entity_type: item.entity_type_desc || '',
      entity_type_desc: item.entity_type_desc || '',
      physical_address: item.physical_address || '',
      telephone_number: item.telephone_number?.toString() || '',
      total_power_units: item.total_power_units?.toString() || '0',
      total_drivers: item.total_drivers?.toString() || '0',
      mcs150_year: item.mcs150_year?.toString() || '',
      mcs150_mileage: item.mcs150_mileage?.toString() || '0',
      basics_data: {}
    };
  } catch (error) {
    console.error('Error in getCarrierOKProfile:', error);
    throw error;
  }
}
