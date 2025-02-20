
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatPhoneNumber, validateField } from "@/utils/formValidation";
import { useState } from "react";

interface OperatorContactProps {
  formData: any;
  setFormData: (data: any) => void;
}

const OperatorContact = ({ formData, setFormData }: OperatorContactProps) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({
      ...formData,
      operator: {
        ...formData.operator,
        phone: formatted
      }
    });
    
    if (formatted.length === 14) {
      const validation = validateField('phone', formatted);
      setFieldErrors(prev => ({ ...prev, phone: validation.error || '' }));
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
    
    const validation = validateField('email', value);
    setFieldErrors(prev => ({ ...prev, email: validation.error || '' }));
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          value={formData.operator?.phone || ''}
          onChange={handlePhoneChange}
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
          placeholder="email@example.com"
          className={fieldErrors.email ? 'border-red-500' : ''}
        />
        {fieldErrors.email && (
          <p className="text-sm text-red-500">{fieldErrors.email}</p>
        )}
      </div>
    </>
  );
};

export default OperatorContact;
