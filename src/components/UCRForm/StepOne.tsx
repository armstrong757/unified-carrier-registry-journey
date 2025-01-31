import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepOneProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepOne = ({ formData, setFormData }: StepOneProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Confirm Your Official Representative</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="registrationYear">
            Registration Year <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.registrationYear}
            onValueChange={(value) =>
              setFormData({ ...formData, registrationYear: value })
            }
          >
            <SelectTrigger id="registrationYear">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="representative">
            Representative <span className="text-red-500">*</span>
          </Label>
          <Input
            id="representative"
            value={formData.representative}
            onChange={(e) =>
              setFormData({ ...formData, representative: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
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
          <Label htmlFor="phone">
            Phone <span className="text-red-500">*</span>
          </Label>
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