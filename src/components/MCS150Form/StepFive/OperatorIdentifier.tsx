
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
    const isEIN = formData.operator?.identifierType === 'ein';
    const formattedValue = isEIN ? formatEIN(value) : formatSSN(value);
    
    setFormData({
      ...formData,
      operator: { 
        ...formData.operator, 
        einSsn: formattedValue 
      },
    });
  };

  const handleTypeChange = (value: 'ein' | 'ssn') => {
    setFormData({
      ...formData,
      operator: { 
        ...formData.operator, 
        identifierType: value,
        einSsn: '' // Clear when changing types
      },
    });
  };

  // Initialize operator data if it doesn't exist
  if (!formData.operator) {
    setFormData({
      ...formData,
      operator: {
        identifierType: 'ssn',
        einSsn: '',
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Label>
            Identifier Type <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.operator?.identifierType || 'ssn'}
            onValueChange={handleTypeChange}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ssn" id="ssn" />
              <Label htmlFor="ssn">SSN</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ein" id="ein" />
              <Label htmlFor="ein">EIN</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="einSsn">
            {formData.operator?.identifierType === 'ein' ? 'EIN' : 'SSN'}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="einSsn"
            value={formData.operator?.einSsn || ''}
            onChange={handleIdentifierChange}
            placeholder={formData.operator?.identifierType === 'ein' ? 'XX-XXXXXXX' : 'XXX-XX-XXXX'}
            maxLength={formData.operator?.identifierType === 'ein' ? 10 : 11}
            className="font-mono"
          />
        </div>
      </div>
    </div>
  );
};

export default OperatorIdentifier;
