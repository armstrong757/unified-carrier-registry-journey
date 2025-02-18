
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StepOneProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepOne = ({ formData, setFormData }: StepOneProps) => {
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
          value={formData.reasonForFiling}
          onValueChange={updateReasonForFiling}
          className="space-y-1.5"
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="biennialUpdate" id="biennialUpdate" className="mt-0.5" />
            <Label htmlFor="biennialUpdate" className="text-sm">
              Biennial Update or Changes
            </Label>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="reactivate" id="reactivate" className="mt-0.5" />
            <Label htmlFor="reactivate" className="text-sm">
              Reactivate
            </Label>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="reapplication" id="reapplication" className="mt-0.5" />
            <Label htmlFor="reapplication" className="text-sm">
              Reapplication (after revocation of new entrant)
            </Label>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="outOfBusiness" id="outOfBusiness" className="mt-0.5" />
            <Label htmlFor="outOfBusiness" className="text-sm">
              Out of Business Notification
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default StepOne;
