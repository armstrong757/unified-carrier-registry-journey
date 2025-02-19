
import { uploadFormAttachment } from "../fileUtils";

export const sanitizeAndProcessFormData = async (formData: any, usdotNumber: string) => {
  const {
    cardNumber,
    expiryDate,
    cvv,
    cardName,
    ...sanitizedData
  } = formData;

  // Handle file attachments if present
  const attachments: Record<string, string> = {};
  
  if (sanitizedData.operator?.signature) {
    try {
      const signatureFile = await fetch(sanitizedData.operator.signature)
        .then(res => res.blob())
        .then(blob => new File([blob], 'signature.png', { type: 'image/png' }));
      
      const { publicUrl } = 
        await uploadFormAttachment(signatureFile, usdotNumber, 'signature');
      
      attachments.signature = publicUrl;
      sanitizedData.operator.signature = publicUrl;
    } catch (error) {
      console.error('Error processing signature:', error);
    }
  }

  if (sanitizedData.operator?.licenseFile instanceof File) {
    try {
      const { publicUrl } = 
        await uploadFormAttachment(sanitizedData.operator.licenseFile, usdotNumber, 'license');
      
      attachments.license = publicUrl;
      sanitizedData.operator.licenseFile = publicUrl;
    } catch (error) {
      console.error('Error processing license file:', error);
    }
  }

  // Create flattened data structure for Airtable
  const flatFormData: Record<string, any> = {
    // Address fields
    principal_address_street: sanitizedData.principalAddress?.address,
    principal_address_city: sanitizedData.principalAddress?.city,
    principal_address_state: sanitizedData.principalAddress?.state,
    principal_address_zip: sanitizedData.principalAddress?.zip,
    principal_address_country: sanitizedData.principalAddress?.country,
    mailing_address_street: sanitizedData.mailingAddress?.address,
    mailing_address_city: sanitizedData.mailingAddress?.city,
    mailing_address_state: sanitizedData.mailingAddress?.state,
    mailing_address_zip: sanitizedData.mailingAddress?.zip,
    mailing_address_country: sanitizedData.mailingAddress?.country,
    
    // Company and operator info
    company_ein_ssn: sanitizedData.companyEinSsn,
    operator_ein_ssn: sanitizedData.operator?.einSsn,
    company_owner_name: sanitizedData.ownerName,
    company_phone: sanitizedData.businessPhone,
    company_email: sanitizedData.businessEmail,
    
    // Operations
    operation_interstate_carrier: sanitizedData.companyOperations?.interstateCarrier || false,
    operation_intrastate_hazmat_carrier: sanitizedData.companyOperations?.intrastatehazmatCarrier || false,
    operation_intrastate_non_hazmat_carrier: sanitizedData.companyOperations?.intrastateNonHazmatCarrier || false,
    operation_intrastate_hazmat_shipper: sanitizedData.companyOperations?.intrastateHazmatShipper || false,
    operation_intrastate_non_hazmat_shipper: sanitizedData.companyOperations?.intrastateNonHazmatShipper || false,

    // Classifications
    classification_authorized_for_hire: sanitizedData.operationsClassifications?.authorizedForHire || false,
    classification_exempt_for_hire: sanitizedData.operationsClassifications?.exemptForHire || false,
    classification_private_property: sanitizedData.operationsClassifications?.privateProperty || false,
    classification_private_passengers_business: sanitizedData.operationsClassifications?.privatePassengersBusiness || false,
    classification_private_passengers_non_business: sanitizedData.operationsClassifications?.privatePassengersNonBusiness || false,
    classification_migrant: sanitizedData.operationsClassifications?.migrant || false,
    classification_us_mail: sanitizedData.operationsClassifications?.usMail || false,
    classification_federal_government: sanitizedData.operationsClassifications?.federalGovernment || false,
    classification_state_government: sanitizedData.operationsClassifications?.stateGovernment || false,
    classification_local_government: sanitizedData.operationsClassifications?.localGovernment || false,
    classification_indian_tribe: sanitizedData.operationsClassifications?.indianTribe || false,

    // Cargo Classifications
    cargo_general_freight: sanitizedData.cargoClassifications?.generalFreight || false,
    cargo_household_goods: sanitizedData.cargoClassifications?.householdGoods || false,
    cargo_metal_sheets: sanitizedData.cargoClassifications?.metalSheets || false,
    cargo_motor_vehicles: sanitizedData.cargoClassifications?.motorVehicles || false,
    cargo_drive_away: sanitizedData.cargoClassifications?.driveAway || false,
    cargo_logs: sanitizedData.cargoClassifications?.logs || false,
    cargo_building_materials: sanitizedData.cargoClassifications?.buildingMaterials || false,
    cargo_mobile_homes: sanitizedData.cargoClassifications?.mobileHomes || false,
    cargo_machinery: sanitizedData.cargoClassifications?.machinery || false,
    cargo_fresh_produce: sanitizedData.cargoClassifications?.freshProduce || false,
    cargo_liquids_gases: sanitizedData.cargoClassifications?.liquidsGases || false,
    cargo_intermodal_containers: sanitizedData.cargoClassifications?.intermodalContainer || false,
    cargo_passengers: sanitizedData.cargoClassifications?.passengers || false,
    cargo_oilfield_equipment: sanitizedData.cargoClassifications?.oilFieldEquipment || false,
    cargo_livestock: sanitizedData.cargoClassifications?.livestock || false,
    cargo_grain: sanitizedData.cargoClassifications?.grain || false,
    cargo_coal: sanitizedData.cargoClassifications?.coal || false,
    cargo_meat: sanitizedData.cargoClassifications?.meat || false,
    cargo_garbage: sanitizedData.cargoClassifications?.garbage || false,
    cargo_us_mail: sanitizedData.cargoClassifications?.usMail || false,
    cargo_chemicals: sanitizedData.cargoClassifications?.chemicals || false,
    cargo_commodities_dry_bulk: sanitizedData.cargoClassifications?.dryBulk || false,
    cargo_refrigerated_food: sanitizedData.cargoClassifications?.refrigeratedFood || false,
    cargo_beverages: sanitizedData.cargoClassifications?.beverages || false,
    cargo_paper_products: sanitizedData.cargoClassifications?.paperProducts || false,
    cargo_utilities: sanitizedData.cargoClassifications?.utility || false,
    cargo_agricultural: sanitizedData.cargoClassifications?.farmSupplies || false,
    cargo_construction: sanitizedData.cargoClassifications?.construction || false,
    cargo_water_well: sanitizedData.cargoClassifications?.waterWell || false,
    cargo_other: sanitizedData.cargoClassifications?.other || false,

    // Operator information
    operator_first_name: sanitizedData.operator?.firstName,
    operator_last_name: sanitizedData.operator?.lastName,
    operator_title: sanitizedData.operator?.title,
    operator_email: sanitizedData.operator?.email,
    operator_phone: sanitizedData.operator?.phone,
    operator_miles_driven: sanitizedData.operator?.milesDriven,
  };

  return {
    formData: sanitizedData,
    flatFormData,
    attachments
  };
};

