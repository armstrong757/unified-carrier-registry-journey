
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CompanyOperationsProps {
  formData: any;
  updateCompanyOperations: (key: string) => void;
}

const CompanyOperations = ({ formData, updateCompanyOperations }: CompanyOperationsProps) => {
  if (!formData.operatingInfoChanges.operations) return null;

  return (
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
  );
};

export default CompanyOperations;
