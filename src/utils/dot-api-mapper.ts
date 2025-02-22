
import { cleanPhoneNumber, parseNumericValue, formatDate } from './dot-data-validation';
import { USDOTData } from '@/types/filing';

export function mapAPIResponse(apiResponse: any): USDOTData {
  console.log('Mapping API response:', apiResponse);
  
  // Extract data from either basics_data or root level
  const data = apiResponse.basics_data && Object.keys(apiResponse.basics_data).length > 0 
    ? apiResponse.basics_data 
    : apiResponse;

  function parseAddress(addressString: string | null) {
    if (!addressString) return null;
    const parts = addressString.split(',').map(part => part.trim());
    if (parts.length >= 3) {
      const street = parts[0];
      const city = parts[1];
      const stateZip = parts[parts.length - 1].split(' ');
      return {
        street,
        city,
        state: stateZip[0],
        zip: stateZip[1],
        country: 'USA'
      };
    }
    return null;
  }

  // Parse addresses
  const physicalAddress = parseAddress(data.physical_address);
  const mailingAddress = parseAddress(data.mailing_address || data.physical_address);

  // Ensure all numeric values are converted to numbers
  const powerUnits = parseNumericValue(data.power_units || data.total_power_units);
  const drivers = parseNumericValue(data.drivers || data.total_drivers);
  const mcs150Year = data.mcs150_year ? parseInt(data.mcs150_year) : undefined;
  const mcs150Mileage = parseNumericValue(data.mcs150_mileage);

  const mappedData: USDOTData = {
    usdotNumber: (data.usdot_number || data.dot_number || '').toString(),
    legalName: data.legal_name || '',
    dbaName: data.dba_name || '',
    operatingStatus: data.operating_status || data.usdot_status || 'NOT AUTHORIZED',
    entityType: data.entity_type || data.entity_type_desc || '',
    physicalAddress: data.physical_address || '',
    physicalAddressStreet: physicalAddress?.street || data.physical_address_street || '',
    physicalAddressCity: physicalAddress?.city || data.physical_address_city || '',
    physicalAddressState: physicalAddress?.state || data.physical_address_state || '',
    physicalAddressZip: physicalAddress?.zip || data.physical_address_zip_code || '',
    physicalAddressCountry: 'USA',
    mailingAddressStreet: mailingAddress?.street || data.mailing_address_street || '',
    mailingAddressCity: mailingAddress?.city || data.mailing_address_city || '',
    mailingAddressState: mailingAddress?.state || data.mailing_address_state || '',
    mailingAddressZip: mailingAddress?.zip || data.mailing_address_zip_code || '',
    mailingAddressCountry: 'USA',
    telephone: cleanPhoneNumber(data.telephone || data.telephone_number) || '',
    powerUnits: powerUnits,
    drivers: drivers,
    busCount: parseNumericValue(data.bus_count) || 0,
    limoCount: parseNumericValue(data.limo_count) || 0,
    minibusCount: parseNumericValue(data.minibus_count) || 0,
    motorcoachCount: parseNumericValue(data.motorcoach_count) || 0,
    vanCount: parseNumericValue(data.van_count) || 0,
    complaintCount: parseNumericValue(data.complaint_count) || 0,
    outOfService: Boolean(data.out_of_service || data.out_of_service_flag),
    outOfServiceDate: formatDate(data.out_of_service_date),
    mcNumber: data.mc_number || '',
    mcs150Date: formatDate(data.mcs150_last_update || data.mcs150_date),
    mcs150Year: mcs150Year,
    mcs150Mileage: mcs150Mileage,
    carrierOperation: data.carrier_operation || '',
    cargoCarried: Array.isArray(data.cargo_carried) ? data.cargo_carried : [],
    insuranceBIPD: parseNumericValue(data.insurance_bipd_on_file) || 0,
    insuranceBond: parseNumericValue(data.insurance_bond_on_file) || 0,
    insuranceCargo: parseNumericValue(data.insurance_cargo_on_file) || 0,
    riskScore: data.risk_score || ''
  };

  console.log('Mapped data:', mappedData);
  return mappedData;
}
