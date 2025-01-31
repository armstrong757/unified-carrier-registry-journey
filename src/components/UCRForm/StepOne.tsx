import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">
        Confirm Your Official Representative
      </h2>

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
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="representative">
            Who is creating this registration?{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="representative"
            value={formData.representative}
            onChange={(e) =>
              setFormData({ ...formData, representative: e.target.value })
            }
            placeholder="Full Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(123) 456-7890"
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="authorization"
            checked={formData.authorization}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, authorization: checked })
            }
          />
          <Label htmlFor="authorization" className="leading-normal">
            I certify that I am authorized to submit this registration{" "}
            <span className="text-red-500">*</span>
          </Label>
        </div>
      </div>
    </div>
  );
};

export default StepOne;