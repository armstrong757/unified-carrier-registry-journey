
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import OperatorBasicInfo from "./StepFive/OperatorBasicInfo";
import OperatorIdentifier from "./StepFive/OperatorIdentifier";
import OperatorContact from "./StepFive/OperatorContact";
import OperatorDetails from "./StepFive/OperatorDetails";
import SignaturePad from "./SignaturePad";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface StepFiveProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepFive = ({ formData, setFormData }: StepFiveProps) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Initialize operator data structure if it doesn't exist
  if (!formData.operator) {
    setFormData({
      ...formData,
      operator: {
        firstName: '',
        lastName: '',
        title: '',
        identifierType: 'ssn',
        einSsn: '',
        phone: '',
        email: '',
        milesDriven: '',
        licenseFile: null,
        signature: '',
      }
    });
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-[800px]">
      <h2 className="text-2xl font-bold text-primary">Operator Information</h2>
      
      <div className="space-y-6">
        <OperatorBasicInfo formData={formData} setFormData={setFormData} />
        
        <div className="space-y-2">
          <Label htmlFor="title">
            Job Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={formData.operator?.title || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                operator: { ...formData.operator, title: e.target.value },
              })
            }
            placeholder="Owner, Manager, etc."
          />
        </div>

        <OperatorIdentifier formData={formData} setFormData={setFormData} />
        <OperatorContact formData={formData} setFormData={setFormData} />
        <OperatorDetails 
          formData={formData} 
          setFormData={setFormData} 
          fieldErrors={fieldErrors}
        />

        <div className="space-y-2">
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
