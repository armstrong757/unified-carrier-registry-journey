
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatEIN, formatSSN, validateField } from "@/utils/formValidation";
import { useState } from "react";

interface OperatorIdentifierProps {
  formData: any;
  setFormData: (data: any) => void;
}

const OperatorIdentifier = ({ formData, setFormData }: OperatorIdentifierProps) => {
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

  return (
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
  );
};

export default OperatorIdentifier;
