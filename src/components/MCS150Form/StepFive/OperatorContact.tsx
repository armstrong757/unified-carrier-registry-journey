
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatPhoneNumber, validateField } from "@/utils/formValidation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface OperatorContactProps {
  formData: any;
  setFormData: (data: any) => void;
}

const OperatorContact = ({ formData, setFormData }: OperatorContactProps) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({
      ...formData,
      operator: {
        ...formData.operator,
        phone: formatted
      }
    });

    // Clear error when user starts typing again
    if (fieldErrors.phone) {
      setFieldErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handlePhoneBlur = () => {
    const value = formData.operator?.phone;
    if (value) {
      const validation = validateField('phone', value);
      if (validation.error) {
        setFieldErrors(prev => ({ ...prev, phone: validation.error }));
        toast({
          variant: "destructive",
          title: "Invalid Phone Number",
          description: validation.error
        });
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      operator: {
        ...formData.operator,
        email: value
      }
    });

    // Clear error when user starts typing again
    if (fieldErrors.email) {
      setFieldErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handleEmailBlur = () => {
    const value = formData.operator?.email;
    if (value) {
      const validation = validateField('email', value);
      if (validation.error) {
        setFieldErrors(prev => ({ ...prev, email: validation.error }));
        toast({
          variant: "destructive",
          title: "Invalid Email",
          description: validation.error
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          value={formData.operator?.phone || ''}
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

      <div className="space-y-2">
        <Label htmlFor="email">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.operator?.email || ''}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          placeholder="email@example.com"
          className={fieldErrors.email ? 'border-red-500' : ''}
        />
        {fieldErrors.email && (
          <p className="text-sm text-red-500">{fieldErrors.email}</p>
        )}
      </div>
    </div>
  );
};

export default OperatorContact;

