
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StepOneProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepOne = ({ formData, setFormData }: StepOneProps) => {
  // Set default value on mount if not already set
  if (!formData.reasonForFiling) {
    setFormData({
      ...formData,
      reasonForFiling: 'biennialUpdate'
    });
  }

  const updateReasonForFiling = (value: string) => {
    setFormData({
      ...formData,
      reasonForFiling: value,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">Reason For Filing</h2>

      <div className="space-y-4">
        <Label>
          Select your reason for filing <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          defaultValue="biennialUpdate"
          value={formData.reasonForFiling}
          onValueChange={updateReasonForFiling}
          className="space-y-1.5"
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="biennialUpdate" id="biennialUpdate" className="mt-0.5" />
            <Label htmlFor="biennialUpdate" className="text-sm font-normal cursor-pointer">
              Biennial Update or Changes
            </Label>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="reactivate" id="reactivate" className="mt-0.5" />
            <Label htmlFor="reactivate" className="text-sm font-normal cursor-pointer">
              Reactivate
            </Label>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="reapplication" id="reapplication" className="mt-0.5" />
            <Label htmlFor="reapplication" className="text-sm font-normal cursor-pointer">
              Reapplication (after revocation of new entrant)
            </Label>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="outOfBusiness" id="outOfBusiness" className="mt-0.5" />
            <Label htmlFor="outOfBusiness" className="text-sm font-normal cursor-pointer">
              Out of Business Notification
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default StepOne;
