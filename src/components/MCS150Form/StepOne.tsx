
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface StepOneProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepOne = ({ formData, setFormData }: StepOneProps) => {
  const updateReasonForFiling = (key: string) => {
    setFormData({
      ...formData,
      reasonForFiling: {
        ...formData.reasonForFiling,
        [key]: !formData.reasonForFiling[key],
      },
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">Reason For Filing</h2>

      <div className="space-y-4">
        <Label>
          Select your reason for filing <span className="text-red-500">*</span>
        </Label>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="biennialUpdate"
              checked={formData.reasonForFiling.biennialUpdate}
              onCheckedChange={() => updateReasonForFiling("biennialUpdate")}
            />
            <Label htmlFor="biennialUpdate">Biennial Update or Changes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reactivate"
              checked={formData.reasonForFiling.reactivate}
              onCheckedChange={() => updateReasonForFiling("reactivate")}
            />
            <Label htmlFor="reactivate">Reactivate</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reapplication"
              checked={formData.reasonForFiling.reapplication}
              onCheckedChange={() => updateReasonForFiling("reapplication")}
            />
            <Label htmlFor="reapplication">
              Reapplication (after revocation of new entrant)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="outOfBusiness"
              checked={formData.reasonForFiling.outOfBusiness}
              onCheckedChange={() => updateReasonForFiling("outOfBusiness")}
            />
            <Label htmlFor="outOfBusiness">Out of Business Notification</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
