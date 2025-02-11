
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CompanyOperations from "./StepFour/CompanyOperations";
import OperationClassifications from "./StepFour/OperationClassifications";
import CargoClassifications from "./StepFour/CargoClassifications";
import VehicleInformation from "./StepFour/VehicleInformation";
import DriverInformation from "./StepFour/DriverInformation";
import HazmatMaterials from "./StepFour/HazmatMaterials";

interface StepFourProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepFour = ({ formData, setFormData }: StepFourProps) => {
  // If user selected "No changes" or didn't select operating info changes, skip this step
  if (formData.hasChanges !== "yes" || !formData.changesToMake.operatingInfo) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-primary">Operating Information</h2>
        <p className="text-gray-600">
          No operating information changes were selected. Click Next to continue.
        </p>
      </div>
    );
  }

  const updateCompanyOperations = (key: string) => {
    setFormData({
      ...formData,
      companyOperations: {
        ...formData.companyOperations,
        [key]: !formData.companyOperations[key],
      },
    });
  };

  const updateOperationClassifications = (key: string) => {
    setFormData({
      ...formData,
      operationsClassifications: {
        ...formData.operationsClassifications,
        [key]: !formData.operationsClassifications[key],
      },
    });
  };

  const updateCargoClassifications = (key: string) => {
    setFormData({
      ...formData,
      cargoClassifications: {
        ...formData.cargoClassifications,
        [key]: !formData.cargoClassifications[key],
      },
    });
  };

  const updateVehicleCount = (
    vehicleType: string,
    field: string,
    value: string
  ) => {
    const numValue = value === "" ? 0 : parseInt(value);
    setFormData({
      ...formData,
      vehicles: {
        ...formData.vehicles,
        [vehicleType]: {
          ...formData.vehicles[vehicleType],
          [field]: numValue,
        },
      },
    });
  };

  const updateDrivers = (field: string, value: string) => {
    setFormData({
      ...formData,
      drivers: {
        ...formData.drivers,
        [field]: value,
      },
    });
  };

  const updateHazmatDetails = (key: string) => {
    setFormData({
      ...formData,
      hazmatDetails: {
        ...formData.hazmatDetails,
        [key]: !formData.hazmatDetails[key],
      },
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">Operating Information</h2>

      <CompanyOperations
        formData={formData}
        updateCompanyOperations={updateCompanyOperations}
      />

      <OperationClassifications
        formData={formData}
        updateOperationClassifications={updateOperationClassifications}
      />

      <CargoClassifications
        formData={formData}
        updateCargoClassifications={updateCargoClassifications}
      />

      <VehicleInformation
        formData={formData}
        updateVehicleCount={updateVehicleCount}
      />

      <DriverInformation
        formData={formData}
        updateDrivers={updateDrivers}
      />

      <HazmatMaterials
        formData={formData}
        updateHazmatDetails={updateHazmatDetails}
      />
    </div>
  );
};

export default StepFour;
