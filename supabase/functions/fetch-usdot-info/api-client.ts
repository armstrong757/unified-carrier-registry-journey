
import { USDOTData, APIResponse } from './types.ts';
import { validateDOTNumber } from './validator.ts';

export async function fetchCarrierData(dotNumber: string, apiKey: string): Promise<USDOTData> {
  console.log('DEBUG: Starting carrier data fetch for DOT number:', dotNumber);
  
  const validDOTNumber = validateDOTNumber(dotNumber);
  const baseUrl = 'https://mobile.fmcsa.dot.gov/qc/services/carriers';
  const url = `${baseUrl}/${validDOTNumber}?webKey=${apiKey}`;
  
  try {
    console.log('DEBUG: Fetching from URL:', url.replace(apiKey, '[REDACTED]'));
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const responseText = await response.text();
    console.log('DEBUG: Raw response length:', responseText.length);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    if (!responseText) {
      throw new Error('Empty response from FMCSA API');
    }

    const data = JSON.parse(responseText) as APIResponse;
    const carrierData = data.content || data;

    return mapCarrierData(validDOTNumber, carrierData, data.basics);
  } catch (error) {
    console.error('DEBUG: Error in fetchCarrierData:', error);
    throw error;
  }
}

function mapCarrierData(dotNumber: string, carrierData: any, basicsData: Record<string, any> = {}): USDOTData {
  return {
    usdotNumber: dotNumber,
    operatingStatus: carrierData.allowedToOperate === 'N' ? 'NOT AUTHORIZED' : 'AUTHORIZED',
    entityType: carrierData.operatingStatus || 'UNKNOWN',
    legalName: carrierData.legalName || 'NOT PROVIDED',
    dbaName: carrierData.dbaName || '',
    physicalAddress: [
      carrierData.physicalAddress,
      carrierData.physicalCity,
      carrierData.physicalState,
      carrierData.physicalZipcode
    ].filter(Boolean).join(', ') || 'NOT PROVIDED',
    telephone: carrierData.phoneNumber || 'NOT PROVIDED',
    powerUnits: parseInt(carrierData.totalPowerUnits) || 0,
    busCount: parseInt(carrierData.totalBuses) || 0,
    limoCount: parseInt(carrierData.totalLimousines) || 0,
    minibusCount: parseInt(carrierData.totalMiniBuses) || 0,
    motorcoachCount: parseInt(carrierData.totalMotorCoaches) || 0,
    vanCount: parseInt(carrierData.totalVans) || 0,
    complaintCount: parseInt(carrierData.totalComplaints) || 0,
    outOfService: carrierData.oosStatus === 'Y',
    outOfServiceDate: carrierData.oosDate || null,
    mcNumber: carrierData.mcNumber || '',
    mcs150LastUpdate: carrierData.mcs150FormDate || null,
    basicsData: basicsData || {},
  };
}

