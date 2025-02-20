
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatEIN, formatSSN, validateField } from "@/utils/formValidation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface OperatorIdentifierProps {
  formData: any;
  setFormData: (data: any) => void;
}

const OperatorIdentifier = ({ formData, setFormData }: OperatorIdentifierProps) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

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

    // Clear error when user starts typing again
    if (fieldErrors.identifier) {
      setFieldErrors(prev => ({ ...prev, identifier: '' }));
    }
  };

  const handleIdentifierBlur = () => {
    const value = formData.operator?.einSsn;
    const type = formData.operator?.identifierType;
    
    if (value) {
      const validation = validateField(type, value);
      if (validation.error) {
        setFieldErrors(prev => ({ ...prev, identifier: validation.error }));
        toast({
          variant: "destructive",
          title: `Invalid ${type.toUpperCase()}`,
          description: validation.error
        });
      }
    }
  };

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      operator: {
        ...formData.operator,
        identifierType: value,
        einSsn: '' // Clear the field when switching types
      }
    });
    setFieldErrors({});
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>
          Identifier Information <span className="text-red-500">*</span>
        </Label>
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-6">
            <RadioGroup
              value={formData.operator?.identifierType || 'ein'}
              onValueChange={handleTypeChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ein" id="operatorEin" />
                <Label htmlFor="operatorEin">EIN</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ssn" id="operatorSsn" />
                <Label htmlFor="operatorSsn">SSN</Label>
              </div>
            </RadioGroup>
          </div>

          <Input
            id="einSsn"
            value={formData.operator?.einSsn || ''}
            onChange={handleIdentifierChange}
            onBlur={handleIdentifierBlur}
            placeholder={formData.operator?.identifierType === 'ein' ? 'XX-XXXXXXX' : 'XXX-XX-XXXX'}
            maxLength={formData.operator?.identifierType === 'ein' ? 10 : 11}
            className={fieldErrors.identifier ? 'border-red-500' : ''}
          />
          {fieldErrors.identifier && (
            <p className="text-sm text-red-500">{fieldErrors.identifier}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperatorIdentifier;
