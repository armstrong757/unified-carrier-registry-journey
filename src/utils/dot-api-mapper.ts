
import { cleanPhoneNumber, parseNumericValue, formatDate } from './dot-data-validation';
import { USDOTData } from '@/types/filing';

export function mapAPIResponse(apiResponse: any): USDOTData {
  console.log('Mapping API response:', apiResponse);
  
  // Extract data from either basics_data or root level
  const data = apiResponse.basics_data || apiResponse;
  console.log('Extracted data for mapping:', data);

  // Map the data to our internal format
  const mappedData: USDOTData = {
    usdotNumber: data.dot_number?.toString() || '',
    legalName: data.legal_name || '',
    dbaName: data.dba_name || '',
    operatingStatus: data.usdot_status || 'NOT AUTHORIZED',
    entityType: data.entity_type_desc || '',
    physicalAddress: data.physical_address || '',
    physicalAddressStreet: data.physical_address_street || '',
    physicalAddressCity: data.physical_address_city || '',
    physicalAddressState: data.physical_address_state || '',
    physicalAddressZip: data.physical_address_zip_code || '',
    physicalAddressCountry: 'USA',
    mailingAddressStreet: data.mailing_address_street || data.physical_address_street || '',
    mailingAddressCity: data.mailing_address_city || data.physical_address_city || '',
    mailingAddressState: data.mailing_address_state || data.physical_address_state || '',
    mailingAddressZip: data.mailing_address_zip_code || data.physical_address_zip_code || '',
    mailingAddressCountry: 'USA',
    telephone: cleanPhoneNumber(data.telephone_number) || '',
    powerUnits: parseNumericValue(data.total_power_units),
    drivers: parseNumericValue(data.total_drivers),
    busCount: parseNumericValue(data.bus_count || 0),
    limoCount: parseNumericValue(data.limo_count || 0),
    minibusCount: parseNumericValue(data.minibus_count || 0),
    motorcoachCount: parseNumericValue(data.motorcoach_count || 0),
    vanCount: parseNumericValue(data.van_count || 0),
    complaintCount: parseNumericValue(data.complaint_count || 0),
    outOfService: Boolean(data.out_of_service_flag),
    outOfServiceDate: formatDate(data.out_of_service_date),
    mcNumber: data.docket || '',
    mcs150Date: formatDate(data.mcs150_date),
    mcs150Year: data.mcs150_year ? parseInt(data.mcs150_year) : undefined,
    mcs150Mileage: parseNumericValue(data.mcs150_mileage),
    carrierOperation: data.carrier_operation || '',
    cargoCarried: Array.isArray(data.cargo_carried) ? data.cargo_carried : [],
    insuranceBIPD: parseNumericValue(data.insurance_bipd_on_file),
    insuranceBond: parseNumericValue(data.insurance_bond_on_file),
    insuranceCargo: parseNumericValue(data.insurance_cargo_on_file),
    riskScore: data.risk_score || ''
  };

  console.log('Mapped data:', mappedData);
  return mappedData;
}
