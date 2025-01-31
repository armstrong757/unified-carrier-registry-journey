import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface StepThreeProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepThree = ({ formData, setFormData }: StepThreeProps) => {
  const [showVehicleInputs, setShowVehicleInputs] = useState(
    formData.needsVehicleChanges === "yes"
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">Vehicles</h2>

      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <p className="text-sm text-gray-600">
          If the autofilled numbers below are incorrect, you should update your
          MCS-150.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Straight Trucks / Tractors:</Label>
            <p className="font-medium">{formData.straightTrucks || 0}</p>
          </div>
          <div>
            <Label>Passenger Vehicles:</Label>
            <p className="font-medium">{formData.passengerVehicles || 0}</p>
          </div>
          <div className="col-span-2">
            <Label>Total Vehicles:</Label>
            <p className="font-medium">
              {(formData.straightTrucks || 0) +
                (formData.passengerVehicles || 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label>
          Do you need to Add or Exclude any commercial motor vehicles (CMVs)
          to/from the numbers above? <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.needsVehicleChanges}
          onValueChange={(value) => {
            setFormData({ ...formData, needsVehicleChanges: value });
            setShowVehicleInputs(value === "yes");
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">No</Label>
          </div>
        </RadioGroup>

        {showVehicleInputs && (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="addVehicles">
                How many CMVs do you need to add that are not already included
                above?
              </Label>
              <Input
                id="addVehicles"
                type="number"
                min="0"
                value={formData.addVehicles}
                onChange={(e) =>
                  setFormData({ ...formData, addVehicles: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excludeVehicles">
                How many CMVs do you want to exclude from your total that operate
                in INTRAstate commerce only?
              </Label>
              <Input
                id="excludeVehicles"
                type="number"
                min="0"
                value={formData.excludeVehicles}
                onChange={(e) =>
                  setFormData({ ...formData, excludeVehicles: e.target.value })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepThree;