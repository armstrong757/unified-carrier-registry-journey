
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";

interface DriverInformationProps {
  formData: any;
  updateDrivers: (field: string, value: string) => void;
}

const DriverInformation = ({ formData, updateDrivers }: DriverInformationProps) => {
  if (!formData.operatingInfoChanges.drivers) return null;

  return (
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
  );
};

export default DriverInformation;
