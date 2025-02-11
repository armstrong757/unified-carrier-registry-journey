import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Truck, Users, Package, AlertTriangle } from "lucide-react";

interface StepFourProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepFour = ({ formData, setFormData }: StepFourProps) => {
  const [showHazmatVehicles, setShowHazmatVehicles] = useState(false);
  const [showPassengerVehicles, setShowPassengerVehicles] = useState(false);

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

      {formData.operatingInfoChanges.classifications && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Operations Classifications</h3>
          </div>
          {[
            { id: "authorizedForHire", label: "Authorized For Hire" },
            { id: "exemptForHire", label: "Exempt For Hire" },
            { id: "privatePassengers", label: "Private Passengers" },
            { id: "privateProperty", label: "Private Property" },
            { id: "migrantWorkers", label: "Migrant Workers" },
            { id: "usMailCarrier", label: "U.S. Mail Carrier" },
            { id: "federalGovernment", label: "Federal Government" },
            { id: "stateGovernment", label: "State Government" },
            { id: "localGovernment", label: "Local Government" },
            { id: "indianTribe", label: "Indian Tribe" },
            { id: "charitable", label: "Charitable Organization" },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={formData.operationsClassifications[id]}
                onCheckedChange={() => updateOperationClassifications(id)}
              />
              <Label htmlFor={id}>{label}</Label>
            </div>
          ))}
        </div>
      )}

      {formData.operatingInfoChanges.cargo && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Cargo Classifications</h3>
          </div>
          {[
            { id: "generalFreight", label: "General Freight" },
            { id: "householdGoods", label: "Household Goods" },
            { id: "metalSheets", label: "Metal: Sheets, Coils, Rolls" },
            { id: "motorVehicles", label: "Motor Vehicles" },
            { id: "driveTow", label: "Drive/Tow Away" },
            { id: "logs", label: "Logs, Poles, Beams, Lumber" },
            { id: "building", label: "Building Materials" },
            { id: "mobile", label: "Mobile Homes" },
            { id: "machinery", label: "Machinery, Large Objects" },
            { id: "fresh", label: "Fresh Produce" },
            { id: "liquids", label: "Liquids/Gases" },
            { id: "intermodal", label: "Intermodal Containers" },
            { id: "passengers", label: "Passengers" },
            { id: "oilfield", label: "Oilfield Equipment" },
            { id: "livestock", label: "Livestock" },
            { id: "grain", label: "Grain, Feed, Hay" },
            { id: "coal", label: "Coal/Coke" },
            { id: "meat", label: "Meat" },
            { id: "garbage", label: "Garbage/Refuse" },
            { id: "usmail", label: "U.S. Mail" },
            { id: "chemicals", label: "Chemicals" },
            { id: "commodities", label: "Commodities Dry Bulk" },
            { id: "refrigerated", label: "Refrigerated Food" },
            { id: "beverages", label: "Beverages" },
            { id: "paper", label: "Paper Products" },
            { id: "utilities", label: "Utilities" },
            { id: "agricultural", label: "Agricultural/Farm Supplies" },
            { id: "construction", label: "Construction" },
            { id: "water", label: "Water Well" },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={formData.cargoClassifications[id]}
                onCheckedChange={() => updateCargoClassifications(id)}
              />
              <Label htmlFor={id}>{label}</Label>
            </div>
          ))}
        </div>
      )}

      {formData.operatingInfoChanges.vehicles && (
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
                            type="number"
                            min="0"
                            value={formData.vehicles[id].owned}
                            onChange={(e) =>
                              updateVehicleCount(id, "owned", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">
                            Term Leased
                          </Label>
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
                          <Label className="text-sm text-gray-600">
                            Trip Leased
                          </Label>
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
                            type="number"
                            min="0"
                            value={formData.vehicles[id].owned}
                            onChange={(e) =>
                              updateVehicleCount(id, "owned", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">
                            Term Leased
                          </Label>
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
                          <Label className="text-sm text-gray-600">
                            Trip Leased
                          </Label>
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
              )}
            </div>
          </div>
        </div>
      )}

      {formData.operatingInfoChanges.drivers && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Driver Information</h3>
          </div>
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

      {formData.operatingInfoChanges.hazmat && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Hazardous Materials</h3>
          </div>
          {[
            { id: "explosives", label: "Explosives" },
            { id: "hazardousWaste", label: "Hazardous Waste" },
            { id: "radioactiveMaterials", label: "Radioactive Materials" },
            {
              id: "inhalationHazard",
              label: "Chemicals Requiring Placards",
            },
            { id: "fuel", label: "Fuel (for commercial use)" },
            { id: "commodityDry", label: "Commodity Dry Bulk" },
            { id: "liquidGas", label: "Liquid/Gas (Bulk)" },
            { id: "explosivesDiv", label: "Explosives Division 1.1" },
            { id: "explosivesDiv2", label: "Explosives Division 1.2" },
            { id: "explosivesDiv3", label: "Explosives Division 1.3" },
            { id: "combustibleLiquid", label: "Combustible Liquid" },
            { id: "flammableLiquid", label: "Flammable Liquid" },
            { id: "flammableSolid", label: "Flammable Solid" },
            { id: "oxidizer", label: "Oxidizer" },
            { id: "organicPeroxide", label: "Organic Peroxide" },
            { id: "poisonA", label: "Poison A" },
            { id: "poisonB", label: "Poison B" },
            { id: "poisonC", label: "Poison C" },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={formData.hazmatDetails[id]}
                onCheckedChange={() => updateHazmatDetails(id)}
              />
              <Label htmlFor={id}>{label}</Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepFour;
