
import { USDOTResponse } from './types.ts';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retry attempt ${MAX_RETRIES - retries + 1} for CarrierOK API request`);
      await sleep(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export async function getCarrierOKProfile(dotNumber: string): Promise<{ items: USDOTResponse[] }> {
  const apiKey = Deno.env.get('CARRIER_OK_API_KEY');
  if (!apiKey) {
    throw new Error('CARRIER_OK_API_KEY is not set');
  }

  const url = `https://carrier-okay-6um2cw59.uc.gateway.dev/api/v2/profile-lite?dot=${dotNumber}`;
  
  console.log(`Making request to CarrierOK API for DOT: ${dotNumber}`);
  
  try {
    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    console.log('CarrierOK API Response:', data);

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error('No carrier data found');
    }

    return data;
  } catch (error) {
    console.error('Error fetching from CarrierOK API:', error);
    throw new Error(`Failed to fetch carrier data: ${error.message}`);
  }
}
