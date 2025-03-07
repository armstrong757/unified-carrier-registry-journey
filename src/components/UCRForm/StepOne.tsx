
import { useState } from "react";
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
import { formatPhoneNumber, validateField } from "@/utils/formValidation";
import { useToast } from "@/hooks/use-toast";

interface StepOneProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepOne = ({ formData, setFormData }: StepOneProps) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });

    // Clear error when user starts typing again
    if (fieldErrors.phone) {
      setFieldErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {  // Only validate if there's a value
      const validation = validateField('phone', value);
      if (validation.error) {
        setFieldErrors(prev => ({ ...prev, phone: validation.error }));
        toast({
          variant: "destructive",
          title: "Invalid Phone Number",
          description: "Please enter a valid 10-digit phone number"
        });
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });

    // Clear error when user starts typing again
    if (fieldErrors.email) {
      setFieldErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {  // Only validate if there's a value
      const validation = validateField('email', value);
      if (validation.error) {
        setFieldErrors(prev => ({ ...prev, email: validation.error }));
        toast({
          variant: "destructive",
          title: "Invalid Email",
          description: "Please enter a valid email address"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Confirm Your Official Representative</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="registrationYear">
            Registration Year <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.registrationYear.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, registrationYear: parseInt(value) })
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
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="representative"
            value={formData.representative || ''}
            onChange={(e) =>
              setFormData({ ...formData, representative: e.target.value })
            }
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            placeholder="email@example.com"
            className={fieldErrors.email ? 'border-red-500' : ''}
          />
          {fieldErrors.email && (
            <p className="text-sm text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            placeholder="(555) 555-5555"
            maxLength={14}
            className={fieldErrors.phone ? 'border-red-500' : ''}
          />
          {fieldErrors.phone && (
            <p className="text-sm text-red-500">{fieldErrors.phone}</p>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="authorization"
            checked={formData.authorization}
            onCheckedChange={(checked: boolean) =>
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
