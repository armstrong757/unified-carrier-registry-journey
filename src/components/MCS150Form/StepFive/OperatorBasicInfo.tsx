
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface OperatorBasicInfoProps {
  formData: any;
  setFormData: (data: any) => void;
}

const OperatorBasicInfo = ({ formData, setFormData }: OperatorBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">
          First Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="firstName"
          value={formData.operator?.firstName || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              operator: { ...formData.operator, firstName: e.target.value },
            })
          }
          placeholder="First Name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">
          Last Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="lastName"
          value={formData.operator?.lastName || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              operator: { ...formData.operator, lastName: e.target.value },
            })
          }
          placeholder="Last Name"
        />
      </div>
    </div>
  );
};

export default OperatorBasicInfo;
