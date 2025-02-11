
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StepOneProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepOne = ({ formData, setFormData }: StepOneProps) => {
  const updateReasonForFiling = (value: string) => {
    const newReasonForFiling = {
      biennialUpdate: value === "biennialUpdate",
      reactivate: value === "reactivate",
      reapplication: value === "reapplication",
      outOfBusiness: value === "outOfBusiness",
    };

    setFormData({
      ...formData,
      reasonForFiling: newReasonForFiling,
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
          value={Object.entries(formData.reasonForFiling).find(([_, value]) => value)?.[0] || ""}
          onValueChange={updateReasonForFiling}
          className="space-y-1.5"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="biennialUpdate" id="biennialUpdate" />
            <Label htmlFor="biennialUpdate">
              Biennial Update or Changes
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="reactivate" id="reactivate" />
            <Label htmlFor="reactivate">
              Reactivate
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="reapplication" id="reapplication" />
            <Label htmlFor="reapplication">
              Reapplication (after revocation of new entrant)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="outOfBusiness" id="outOfBusiness" />
            <Label htmlFor="outOfBusiness">
              Out of Business Notification
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default StepOne;
