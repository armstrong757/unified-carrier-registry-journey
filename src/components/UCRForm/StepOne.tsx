import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface StepOneProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepOne = ({ formData, setFormData }: StepOneProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Step 1: Registration</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="registrationYear">Registration Year</Label>
          <Input
            id="registrationYear"
            value={formData.registrationYear}
            onChange={(e) =>
              setFormData({ ...formData, registrationYear: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="representative">Representative</Label>
          <Input
            id="representative"
            value={formData.representative}
            onChange={(e) =>
              setFormData({ ...formData, representative: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="authorization"
            checked={formData.authorization}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, authorization: checked })
            }
            className="mt-1"
          />
          <Label htmlFor="authorization" className="text-sm leading-normal">
            I certify that I am authorized to submit this registration{" "}
            <span className="text-red-500">*</span>
          </Label>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
