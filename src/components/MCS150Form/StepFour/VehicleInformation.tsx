
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Truck, Users, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import TrucksAndTrailers from "./VehicleTypes/TrucksAndTrailers";
import HazmatVehicles from "./VehicleTypes/HazmatVehicles";
import PassengerVehicles from "./VehicleTypes/PassengerVehicles";

interface VehicleInformationProps {
  formData: any;
  updateVehicleCount: (vehicleType: string, field: string, value: string) => void;
}

const VehicleInformation = ({
  formData,
  updateVehicleCount,
}: VehicleInformationProps) => {
  const [showHazmatVehicles, setShowHazmatVehicles] = useState(false);
  const [showPassengerVehicles, setShowPassengerVehicles] = useState(false);

  if (!formData.operatingInfoChanges.vehicles) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Truck className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          Number of Vehicles <span className="text-red-500">*</span>
        </h3>
      </div>
      
      <div className="space-y-6">
        <TrucksAndTrailers formData={formData} updateVehicleCount={updateVehicleCount} />

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => setShowHazmatVehicles(!showHazmatVehicles)}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          {showHazmatVehicles ? "Hide" : "Show"} Hazmat Vehicles
          {showHazmatVehicles ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </Button>

        {showHazmatVehicles && (
          <HazmatVehicles formData={formData} updateVehicleCount={updateVehicleCount} />
        )}

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => setShowPassengerVehicles(!showPassengerVehicles)}
        >
          <Users className="h-4 w-4 mr-2" />
          {showPassengerVehicles ? "Hide" : "Show"} Passenger Vehicles
          {showPassengerVehicles ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </Button>

        {showPassengerVehicles && (
          <PassengerVehicles formData={formData} updateVehicleCount={updateVehicleCount} />
        )}
      </div>
    </div>
  );
};

export default VehicleInformation;
