
export async function fetchAndValidateData(data: any) {
  if (!data || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error('Invalid response format from CarrierOK API');
  }

  const carrierData = data.items[0];
  
  // Map the response to our expected format
  return {
    items: [{
      ...carrierData,
      // Ensure these fields are always present with default values if needed
      dba_flag: Boolean(carrierData.dba_flag),
      dba_name: carrierData.dba_name || '',
      physical_address: carrierData.physical_address || '',
      telephone: carrierData.telephone_number || '',
      power_units: parseInt(carrierData.total_power_units) || 0,
      drivers: parseInt(carrierData.total_drivers) || 0,
      mcs150_last_update: carrierData.mcs150_date || null,
      out_of_service: Boolean(carrierData.out_of_service_flag),
      out_of_service_date: carrierData.out_of_service_date || null,
      operating_status: carrierData.usdot_status || 'Unknown',
      entity_type: carrierData.entity_type_desc || 'Unknown',
      mileage_year: carrierData.mcs150_year || '',
      mileage: carrierData.mcs150_mileage || '0',
      // Parse addresses
      physical_address_parsed: parseAddress(carrierData.physical_address),
      mailing_address_parsed: parseAddress(carrierData.physical_address), // Use physical as fallback if mailing not provided
    }],
    total_count: 1
  };
}

function parseAddress(addressString: string) {
  // Default structure
  const defaultAddress = {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA'
  };

  if (!addressString) {
    return defaultAddress;
  }

  try {
    // Expected format: "street, city, state zip"
    const parts = addressString.split(',').map(part => part.trim());
    
    if (parts.length >= 2) {
      const street = parts[0];
      const cityStateZip = parts[parts.length - 1].split(' ');
      
      return {
        street: street,
        city: parts[1],
        state: cityStateZip[0] || '',
        zip: cityStateZip[1] || '',
        country: 'USA'
      };
    }
  } catch (error) {
    console.error('Error parsing address:', error);
  }

  return defaultAddress;
}
