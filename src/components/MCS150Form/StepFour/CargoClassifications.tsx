
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Package } from "lucide-react";

interface CargoClassificationsProps {
  formData: any;
  updateCargoClassifications: (key: string) => void;
}

const CargoClassifications = ({
  formData,
  updateCargoClassifications,
}: CargoClassificationsProps) => {
  if (!formData.operatingInfoChanges.cargo) return null;

  return (
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
  );
};

export default CargoClassifications;
