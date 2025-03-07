
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";

interface StepThreeProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepThree = ({ formData, setFormData }: StepThreeProps) => {
  const [showVehicleInputs, setShowVehicleInputs] = useState(
    formData.needsVehicleChanges === "yes"
  );

  // Initialize straightTrucks from powerUnits if not already set
  useEffect(() => {
    if (!formData.straightTrucks && formData.powerUnits) {
      setFormData({
        ...formData,
        straightTrucks: formData.powerUnits
      });
    }
  }, [formData.powerUnits]);

  const handleVehicleCountChange = (field: string, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const formatted = numericValue ? parseInt(numericValue).toLocaleString() : '0';
    
    setFormData({
      ...formData,
      [field]: formatted
    });
  };

  // Calculate total vehicles and log for verification
  const calculateTotalVehicles = () => {
    const straightTrucks = parseInt(String(formData.straightTrucks || '0').replace(/,/g, ''));
    const passengerVehicles = parseInt(String(formData.passengerVehicles || '0').replace(/,/g, ''));
    const addVehicles = parseInt(String(formData.addVehicles || '0').replace(/,/g, ''));
    const excludeVehicles = parseInt(String(formData.excludeVehicles || '0').replace(/,/g, ''));

    return straightTrucks + passengerVehicles + addVehicles - excludeVehicles;
  };

  const totalVehicles = calculateTotalVehicles();

  useEffect(() => {
    console.log('UCR Form Vehicle Data:', {
      straightTrucks: formData.straightTrucks,
      passengerVehicles: formData.passengerVehicles,
      addVehicles: formData.addVehicles,
      excludeVehicles: formData.excludeVehicles,
      totalVehicles
    });
  }, [formData.straightTrucks, formData.passengerVehicles, formData.addVehicles, formData.excludeVehicles]);

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
            <p className="font-medium">{String(formData.straightTrucks || 0).toLocaleString()}</p>
          </div>
          <div>
            <Label>Passenger Vehicles:</Label>
            <p className="font-medium">{String(formData.passengerVehicles || 0).toLocaleString()}</p>
          </div>
          <div className="col-span-2">
            <Label>Total Vehicles:</Label>
            <p className="font-medium">{totalVehicles.toLocaleString()}</p>
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
            if (value === "no") {
              setFormData({
                ...formData,
                needsVehicleChanges: value,
                addVehicles: '0',
                excludeVehicles: '0'
              });
            }
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
                type="text"
                value={String(formData.addVehicles || '0')}
                onChange={(e) => handleVehicleCountChange('addVehicles', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excludeVehicles">
                How many CMVs do you want to exclude from your total that operate
                in INTRAstate commerce only?
              </Label>
              <Input
                id="excludeVehicles"
                type="text"
                value={String(formData.excludeVehicles || '0')}
                onChange={(e) => handleVehicleCountChange('excludeVehicles', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepThree;
