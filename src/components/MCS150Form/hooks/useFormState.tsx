
import { useState } from "react";

export const useFormState = () => {
  const [formData, setFormData] = useState({
    reasonForFiling: "biennialUpdate",
    hasChanges: "no",
    changesToMake: {
      companyInfo: false,
      operatingInfo: false,
      other: false,
    },
    companyInfoChanges: {
      ownerName: false,
      address: false,
      phone: false,
      email: false,
      companyName: false,
      einSsn: false,
    },
    operatingInfoChanges: {
      vehicles: false,
      drivers: false,
      operations: false,
      classifications: false,
      cargo: false,
      hazmat: false,
    },
    // Company Information
    ownerName: "",
    principalAddress: {
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "USA",
    },
    mailingAddress: {
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "USA",
    },
    businessPhone: "",
    businessEmail: "",
    companyName: "",
    companyEinSsn: "", // Added company EIN/SSN field
    
    // Operations Information (renamed from operating)
    companyOperations: {
      interstateCarrier: false,
      intrastatehazmatCarrier: false,
      intrastateNonHazmatCarrier: false,
      intrastateHazmatShipper: false,
      intrastateNonHazmatShipper: false,
    },
    operationsClassifications: {
      authorizedForHire: false,
      exemptForHire: false,
      privateProperty: false,
      privatePassengersBusiness: false,
      privatePassengersNonBusiness: false,
      migrant: false,
      usMail: false,
      federalGovernment: false,
      stateGovernment: false,
      localGovernment: false,
      indianTribe: false,
    },
    cargoClassifications: {
      generalFreight: false,
      metalSheets: false,
      driveAway: false,
      buildingMaterials: false,
      machinery: false,
      liquidsGases: false,
      passengers: false,
      livestock: false,
      coal: false,
      garbage: false,
      chemicals: false,
      refrigeratedFood: false,
      paperProducts: false,
      farmSupplies: false,
      waterWell: false,
      householdGoods: false,
      motorVehicles: false,
      logs: false,
      mobileHomes: false,
      freshProduce: false,
      intermodalContainer: false,
      oilFieldEquipment: false,
      grain: false,
      meat: false,
      usMail: false,
      dryBulk: false,
      beverages: false,
      utility: false,
      construction: false,
      other: false,
    },
    vehicles: {
      straightTrucks: { owned: 0, termLeased: 0, tripLeased: 0 },
      truckTractors: { owned: 0, termLeased: 0, tripLeased: 0 },
      trailers: { owned: 0, termLeased: 0, tripLeased: 0 },
      hazmatTrucks: { owned: 0, termLeased: 0, tripLeased: 0 },
      hazmatTrailers: { owned: 0, termLeased: 0, tripLeased: 0 },
      motorCoach: { owned: 0, termLeased: 0, tripLeased: 0 },
      schoolBusSmall: { owned: 0, termLeased: 0, tripLeased: 0 },
      schoolBusMedium: { owned: 0, termLeased: 0, tripLeased: 0 },
      schoolBusLarge: { owned: 0, termLeased: 0, tripLeased: 0 },
      busLarge: { owned: 0, termLeased: 0, tripLeased: 0 },
      vanSmall: { owned: 0, termLeased: 0, tripLeased: 0 },
      vanMedium: { owned: 0, termLeased: 0, tripLeased: 0 },
      limousineSmall: { owned: 0, termLeased: 0, tripLeased: 0 },
      limousineMedium: { owned: 0, termLeased: 0, tripLeased: 0 },
    },
    drivers: {
      interstate: "0",
      intrastate: "0",
      total: "0",
      cdl: "0",
    },
    hazmatDetails: {
      explosives: false,
      hazardousWaste: false,
      radioactiveMaterials: false,
      inhalationHazard: false,
      fuel: false,
      commodityDry: false,
      liquidGas: false,
      explosivesDiv: false,
      explosivesDiv2: false,
      explosivesDiv3: false,
      combustibleLiquid: false,
      flammableLiquid: false,
      flammableSolid: false,
      oxidizer: false,
      organicPeroxide: false,
      poisonA: false,
      poisonB: false,
      poisonC: false,
    },
    
    // Operator Information
    operator: {
      firstName: "", // Added first name
      lastName: "", // Added last name
      title: "",
      email: "", // Added email
      phone: "", // Added phone
      einSsn: "", // Renamed to einSsn for operator
      milesDriven: "",
      licenseFile: null,
      signature: "",
    },
    
    // Billing Information
    billing: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      termsAccepted: false,
    },
  });

  return { formData, setFormData };
};
