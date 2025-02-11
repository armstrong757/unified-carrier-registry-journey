
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";

interface HazmatMaterialsProps {
  formData: any;
  updateHazmatDetails: (key: string) => void;
}

const HazmatMaterials = ({ formData, updateHazmatDetails }: HazmatMaterialsProps) => {
  if (!formData.operatingInfoChanges.hazmat) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Hazardous Materials</h3>
      </div>
      {[
        { id: "explosives", label: "Explosives" },
        { id: "hazardousWaste", label: "Hazardous Waste" },
        { id: "radioactiveMaterials", label: "Radioactive Materials" },
        { id: "inhalationHazard", label: "Chemicals Requiring Placards" },
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
  );
};

export default HazmatMaterials;
