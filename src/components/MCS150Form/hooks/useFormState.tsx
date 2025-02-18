
import { useState } from "react";

export const useFormState = () => {
  const [formData, setFormData] = useState({
    reasonForFiling: {
      biennialUpdate: true,
      reactivate: false,
      reapplication: false,
      outOfBusiness: false,
    },
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
    einSsn: "",
    companyOperations: {
      interstateCarrier: false,
      intrastatehazmatCarrier: false,
      intrastateNonHazmatCarrier: false,
      intrastateHazmatShipper: false,
      intrastateNonHazmatShipper: false,
    },
    operationsClassifications: {},
    cargoClassifications: {},
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
    hazmatDetails: {},
    operator: {
      firstName: "",
      lastName: "",
      title: "",  // Added title field
      email: "",
      phone: "",
      einSsn: "",
      milesDriven: "",  // Added milesDriven field
      licenseFile: null,
      signature: "",
    },
    billing: {
      cardType: "credit",
      termsAccepted: false,
    },
  });

  return { formData, setFormData };
};
