
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck } from "lucide-react";

interface OperationClassificationsProps {
  formData: any;
  updateOperationClassifications: (key: string) => void;
}

const OperationClassifications = ({
  formData,
  updateOperationClassifications,
}: OperationClassificationsProps) => {
  if (!formData.operatingInfoChanges.classifications) return null;

  return (
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
  );
};

export default OperationClassifications;
