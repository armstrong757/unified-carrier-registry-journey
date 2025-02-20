import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { formatEIN, formatSSN, formatPhoneNumber, validateField } from "@/utils/formValidation";
import { useState } from "react";
import SignaturePad from "./SignaturePad";

interface StepFiveProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepFive = ({ formData, setFormData }: StepFiveProps) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const type = formData.operator?.identifierType || 'ein';
    
    const formatted = type === 'ein' ? formatEIN(value) : formatSSN(value);
    
    setFormData({
      ...formData,
      operator: {
        ...formData.operator,
        einSsn: formatted
      }
    });

    if ((type === 'ein' && formatted.length === 10) || 
        (type === 'ssn' && formatted.length === 11)) {
      const validation = validateField(type, formatted);
      setFieldErrors(prev => ({ ...prev, identifier: validation.error || '' }));
    }
  };

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

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    setFormData({
      ...formData,
      operator: {
        ...formData.operator,
        milesDriven: formatted
      }
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">Operator Information</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              value={formData.operator?.firstName || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  operator: { ...formData.operator, firstName: e.target.value },
                })
              }
              placeholder="First Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              value={formData.operator?.lastName || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  operator: { ...formData.operator, lastName: e.target.value },
                })
              }
              placeholder="Last Name"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>
            Identifier Type <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.operator?.identifierType || 'ein'}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                operator: { ...formData.operator, identifierType: value, einSsn: '' },
              })
            }
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ein" id="operatorEin" />
              <Label htmlFor="operatorEin">Employer Identification Number (EIN)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ssn" id="operatorSsn" />
              <Label htmlFor="operatorSsn">Social Security Number (SSN)</Label>
            </div>
          </RadioGroup>
          
          <div className="space-y-2">
            <Label htmlFor="einSsn">
              {formData.operator?.identifierType === 'ein' ? 'EIN' : 'SSN'}{' '}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="einSsn"
              value={formData.operator?.einSsn || ''}
              onChange={handleIdentifierChange}
              placeholder={formData.operator?.identifierType === 'ein' ? 'XX-XXXXXXX' : 'XXX-XX-XXXX'}
              maxLength={formData.operator?.identifierType === 'ein' ? 10 : 11}
              className={fieldErrors.identifier ? 'border-red-500' : ''}
            />
            {fieldErrors.identifier && (
              <p className="text-sm text-red-500">{fieldErrors.identifier}</p>
            )}
          </div>
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="milesDriven">
            Miles Driven Last 12 Months <span className="text-red-500">*</span>
          </Label>
          <Input
            id="milesDriven"
            value={formData.operator?.milesDriven || ''}
            onChange={handleMileageChange}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            value={formData.operator?.title || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                operator: { ...formData.operator, title: e.target.value },
              })
            }
            placeholder="Job Title"
          />
        </div>

        <div className="space-y-4">
          <Label>Signature <span className="text-red-500">*</span></Label>
          <SignaturePad
            onChange={(signature) =>
              setFormData({
                ...formData,
                operator: { ...formData.operator, signature },
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default StepFive;
