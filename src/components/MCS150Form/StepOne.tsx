
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

      <div className="space-y-6">
        <Label>
          Select your reason for filing <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={Object.entries(formData.reasonForFiling).find(([_, value]) => value)?.[0] || ""}
          onValueChange={updateReasonForFiling}
          className="space-y-4"
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="biennialUpdate" id="biennialUpdate" className="mt-1" />
            <Label htmlFor="biennialUpdate" className="leading-normal">
              Biennial Update or Changes
            </Label>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="reactivate" id="reactivate" className="mt-1" />
            <Label htmlFor="reactivate" className="leading-normal">
              Reactivate
            </Label>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="reapplication" id="reapplication" className="mt-1" />
            <Label htmlFor="reapplication" className="leading-normal">
              Reapplication (after revocation of new entrant)
            </Label>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="outOfBusiness" id="outOfBusiness" className="mt-1" />
            <Label htmlFor="outOfBusiness" className="leading-normal">
              Out of Business Notification
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default StepOne;
