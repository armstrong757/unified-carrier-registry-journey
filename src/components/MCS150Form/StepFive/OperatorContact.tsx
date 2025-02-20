
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatPhoneNumber, validateField } from "@/utils/formValidation";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface OperatorContactProps {
  formData: any;
  setFormData: (data: any) => void;
}

const OperatorContact = ({ formData, setFormData }: OperatorContactProps) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    
    console.log('Phone Change:', {
      input: e.target.value,
      formatted,
      current: formData.operator?.phone
    });

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
      
      if (validation.error) {
        toast({
          variant: "destructive",
          title: "Invalid phone number",
          description: validation.error
        });
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    console.log('Email Change:', {
      input: value,
      current: formData.operator?.email
    });

    setFormData({
      ...formData,
      operator: {
        ...formData.operator,
        email: value
      }
    });
    
    const validation = validateField('email', value);
    setFieldErrors(prev => ({ ...prev, email: validation.error || '' }));
    
    if (validation.error) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: validation.error
      });
    }
  };

  // Log whenever operator contact info changes
  useEffect(() => {
    console.log('Operator Contact Info:', {
      phone: formData.operator?.phone,
      email: formData.operator?.email,
      errors: fieldErrors
    });
  }, [formData.operator?.phone, formData.operator?.email, fieldErrors]);

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
    </div>
  );
};

export default OperatorContact;
