
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface HazmatVehiclesProps {
  formData: any;
  updateVehicleCount: (vehicleType: string, field: string, value: string) => void;
}

const HazmatVehicles = ({ formData, updateVehicleCount }: HazmatVehiclesProps) => {
  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value ? parseInt(value).toLocaleString() : '';
    return formatted;
  };

  const vehicles = [
    { id: "hazmatTrucks", label: "Hazmat Cargo Tank Trucks" },
    { id: "hazmatTrailers", label: "Hazmat Cargo Tank Trailers" },
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

export default HazmatVehicles;
