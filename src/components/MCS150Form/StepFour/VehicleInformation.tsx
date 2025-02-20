
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Truck, Users, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

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

  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value ? parseInt(value).toLocaleString() : '';
    return formatted;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Truck className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          Number of Vehicles <span className="text-red-500">*</span>
        </h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-4">Trucks and Trailers</h4>
          {[
            { id: "straightTrucks", label: "Straight Trucks" },
            { id: "truckTractors", label: "Truck Tractors" },
            { id: "trailers", label: "Trailers" },
          ].map(({ id, label }) => (
            <div key={id} className="mb-4">
              <Label className="mb-2">{label}</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Owned</Label>
                  <Input
                    type="text"
                    value={formData.vehicles[id].owned}
                    onChange={(e) => {
                      const formatted = handleNumericInput(e);
                      updateVehicleCount(id, "owned", formatted);
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Term Leased</Label>
                  <Input
                    type="text"
                    value={formData.vehicles[id].termLeased}
                    onChange={(e) => {
                      const formatted = handleNumericInput(e);
                      updateVehicleCount(id, "termLeased", formatted);
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Trip Leased</Label>
                  <Input
                    type="text"
                    value={formData.vehicles[id].tripLeased}
                    onChange={(e) => {
                      const formatted = handleNumericInput(e);
                      updateVehicleCount(id, "tripLeased", formatted);
                    }}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}

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
            <div className="mt-4 space-y-4">
              {[
                { id: "hazmatTrucks", label: "Hazmat Cargo Tank Trucks" },
                { id: "hazmatTrailers", label: "Hazmat Cargo Tank Trailers" },
              ].map(({ id, label }) => (
                <div key={id} className="mb-4">
                  <Label className="mb-2">{label}</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Owned</Label>
                      <Input
                        type="text"
                        value={formData.vehicles[id].owned}
                        onChange={(e) => {
                          const formatted = handleNumericInput(e);
                          updateVehicleCount(id, "owned", formatted);
                        }}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Term Leased</Label>
                      <Input
                        type="text"
                        value={formData.vehicles[id].termLeased}
                        onChange={(e) => {
                          const formatted = handleNumericInput(e);
                          updateVehicleCount(id, "termLeased", formatted);
                        }}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Trip Leased</Label>
                      <Input
                        type="text"
                        value={formData.vehicles[id].tripLeased}
                        onChange={(e) => {
                          const formatted = handleNumericInput(e);
                          updateVehicleCount(id, "tripLeased", formatted);
                        }}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="mt-4 space-y-4">
              {[
                { id: "motorCoach", label: "Motor Coach" },
                {
                  id: "schoolBusSmall",
                  label: "School Bus (8 or less Passengers)",
                },
                {
                  id: "schoolBusMedium",
                  label: "School Bus (9-15 Passengers)",
                },
                {
                  id: "schoolBusLarge",
                  label: "School Bus (16+ Passengers)",
                },
                { id: "busLarge", label: "Bus (16+ Passengers)" },
                { id: "vanSmall", label: "Van (8 or less Passengers)" },
                { id: "vanMedium", label: "Van (9-15 Passengers)" },
                {
                  id: "limousineSmall",
                  label: "Limousine (8 or less Passengers)",
                },
                {
                  id: "limousineMedium",
                  label: "Limousine (9-15 Passengers)",
                },
              ].map(({ id, label }) => (
                <div key={id} className="mb-4">
                  <Label className="mb-2">{label}</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Owned</Label>
                      <Input
                        type="text"
                        value={formData.vehicles[id].owned}
                        onChange={(e) => {
                          const formatted = handleNumericInput(e);
                          updateVehicleCount(id, "owned", formatted);
                        }}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Term Leased</Label>
                      <Input
                        type="text"
                        value={formData.vehicles[id].termLeased}
                        onChange={(e) => {
                          const formatted = handleNumericInput(e);
                          updateVehicleCount(id, "termLeased", formatted);
                        }}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Trip Leased</Label>
                      <Input
                        type="text"
                        value={formData.vehicles[id].tripLeased}
                        onChange={(e) => {
                          const formatted = handleNumericInput(e);
                          updateVehicleCount(id, "tripLeased", formatted);
                        }}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleInformation;
