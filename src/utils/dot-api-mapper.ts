
import { cleanPhoneNumber, parseNumericValue, formatDate } from './dot-data-validation';

export function mapAPIResponse(apiResponse: any) {
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

  const mappedData = {
    usdot_number: data.usdot_number || data.dot_number || '',
    legal_name: data.legal_name || '',
    dba_name: data.dba_name || '',
    operating_status: data.operating_status || data.usdot_status || 'NOT AUTHORIZED',
    entity_type: data.entity_type || data.entity_type_desc || '',
    physical_address: data.physical_address || '',
    telephone: cleanPhoneNumber(data.telephone || data.telephone_number),
    power_units: parseNumericValue(data.power_units || data.total_power_units),
    drivers: parseNumericValue(data.drivers || data.total_drivers),
    mcs150_last_update: formatDate(data.mcs150_last_update || data.mcs150_date),
    out_of_service: Boolean(data.out_of_service || data.out_of_service_flag),
    out_of_service_date: formatDate(data.out_of_service_date),
    physical_address_parsed: physicalAddress || {
      street: data.api_physical_address_street || data.physical_address_street || '',
      city: data.api_physical_address_city || data.physical_address_city || '',
      state: data.api_physical_address_state || data.physical_address_state || '',
      zip: data.api_physical_address_zip || data.physical_address_zip_code || '',
      country: data.api_physical_address_country || 'USA'
    },
    mailing_address_parsed: mailingAddress || {
      street: data.api_mailing_address_street || data.mailing_address_street || '',
      city: data.api_mailing_address_city || data.mailing_address_city || '',
      state: data.api_mailing_address_state || data.mailing_address_state || '',
      zip: data.api_mailing_address_zip || data.mailing_address_zip_code || '',
      country: data.api_mailing_address_country || 'USA'
    }
  };

  console.log('Mapped data:', mappedData);
  return mappedData;
}
