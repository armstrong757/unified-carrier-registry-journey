
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PassengerVehiclesProps {
  formData: any;
  updateVehicleCount: (vehicleType: string, field: string, value: string) => void;
}

const PassengerVehicles = ({ formData, updateVehicleCount }: PassengerVehiclesProps) => {
  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value ? parseInt(value).toLocaleString() : '';
    return formatted;
  };

  const vehicles = [
    { id: "motorCoach", label: "Motor Coach" },
    { id: "schoolBusSmall", label: "School Bus (8 or less Passengers)" },
    { id: "schoolBusMedium", label: "School Bus (9-15 Passengers)" },
    { id: "schoolBusLarge", label: "School Bus (16+ Passengers)" },
    { id: "busLarge", label: "Bus (16+ Passengers)" },
    { id: "vanSmall", label: "Van (8 or less Passengers)" },
    { id: "vanMedium", label: "Van (9-15 Passengers)" },
    { id: "limousineSmall", label: "Limousine (8 or less Passengers)" },
    { id: "limousineMedium", label: "Limousine (9-15 Passengers)" },
  ];

  return (
    <div className="mt-4 space-y-4">
      {vehicles.map(({ id, label }) => (
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
  );
};

export default PassengerVehicles;
