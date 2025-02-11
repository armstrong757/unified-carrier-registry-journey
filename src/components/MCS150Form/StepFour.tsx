
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

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

  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">Operating Information</h2>

      {formData.operatingInfoChanges.operations && (
        <div className="space-y-4">
          <Label>
            Choose Company Operations <span className="text-red-500">*</span>
          </Label>
          {[
            {
              id: "interstateCarrier",
              label: "Interstate Carrier",
            },
            {
              id: "intrastatehazmatCarrier",
              label: "Intrastate Hazmat Carrier",
            },
            {
              id: "intrastateNonHazmatCarrier",
              label: "Intrastate Non-Hazmat Carrier",
            },
            {
              id: "intrastateHazmatShipper",
              label: "Intrastate Hazmat Shipper",
            },
            {
              id: "intrastateNonHazmatShipper",
              label: "Intrastate Non-Hazmat Shipper",
            },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={formData.companyOperations[id]}
                onCheckedChange={() => updateCompanyOperations(id)}
              />
              <Label htmlFor={id}>{label}</Label>
            </div>
          ))}
        </div>
      )}

      {formData.operatingInfoChanges.vehicles && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">
            Number of Vehicles <span className="text-red-500">*</span>
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-4">Trucks and Trailers</h4>
              {[
                { id: "straightTrucks", label: "Straight Trucks" },
                { id: "truckTractors", label: "Truck Tractors" },
                { id: "trailers", label: "Trailers" },
                { id: "hazmatTrucks", label: "Hazmat Cargo Tank Trucks" },
                { id: "hazmatTrailers", label: "Hazmat Cargo Tank Trailers" },
              ].map(({ id, label }) => (
                <div key={id} className="mb-4">
                  <Label className="mb-2">{label}</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Owned</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.vehicles[id].owned}
                        onChange={(e) =>
                          updateVehicleCount(id, "owned", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Term Leased</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.vehicles[id].termLeased}
                        onChange={(e) =>
                          updateVehicleCount(id, "termLeased", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Trip Leased</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.vehicles[id].tripLeased}
                        onChange={(e) =>
                          updateVehicleCount(id, "tripLeased", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-medium mb-4">Passenger Vehicles</h4>
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
                        type="number"
                        min="0"
                        value={formData.vehicles[id].owned}
                        onChange={(e) =>
                          updateVehicleCount(id, "owned", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Term Leased</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.vehicles[id].termLeased}
                        onChange={(e) =>
                          updateVehicleCount(id, "termLeased", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Trip Leased</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.vehicles[id].tripLeased}
                        onChange={(e) =>
                          updateVehicleCount(id, "tripLeased", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {formData.operatingInfoChanges.drivers && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Driver Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interstateDrivers">Interstate Drivers</Label>
              <Input
                id="interstateDrivers"
                type="number"
                min="0"
                value={formData.drivers.interstate}
                onChange={(e) => updateDrivers("interstate", e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intrastateDrivers">Intrastate Drivers</Label>
              <Input
                id="intrastateDrivers"
                type="number"
                min="0"
                value={formData.drivers.intrastate}
                onChange={(e) => updateDrivers("intrastate", e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalDrivers">
                Total Drivers <span className="text-red-500">*</span>
              </Label>
              <Input
                id="totalDrivers"
                type="number"
                min="0"
                value={formData.drivers.total}
                onChange={(e) => updateDrivers("total", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cdlDrivers">
                CDL Drivers <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cdlDrivers"
                type="number"
                min="0"
                value={formData.drivers.cdl}
                onChange={(e) => updateDrivers("cdl", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepFour;
