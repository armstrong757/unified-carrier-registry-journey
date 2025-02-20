
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatEIN, formatSSN } from "@/utils/formValidation";

interface OperatorIdentifierProps {
  formData: any;
  setFormData: (data: any) => void;
}

const OperatorIdentifier = ({ formData, setFormData }: OperatorIdentifierProps) => {
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
  };

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      operator: {
        ...formData.operator,
        identifierType: value,
        einSsn: ''
      }
    });
  };

  return (
    <div className="space-y-4">
      <Label>
        Identifier Type <span className="text-red-500">*</span>
      </Label>
      <RadioGroup
        value={formData.operator?.identifierType || 'ein'}
        onValueChange={handleTypeChange}
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
        />
      </div>
    </div>
  );
};

export default OperatorIdentifier;
