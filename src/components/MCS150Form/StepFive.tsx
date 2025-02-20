
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
        identifierType: 'ein',
        einSsn: '',
        phone: '',
        email: '',
        title: '',
        milesDriven: '',
        licenseFile: null,
        signature: '',
      }
    });
  }

  const validateFile = (file: File | null) => {
    if (!file) {
      return { isValid: true, error: "" };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "File size must be less than 5MB"
      };
    }

    if (!allowedTypes.includes(fileExtension)) {
      return {
        isValid: false,
        error: "File must be PDF, JPG, or PNG"
      };
    }

    return { isValid: true, error: "" };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const validation = validateFile(file);

    if (!validation.isValid) {
      setFieldErrors(prev => ({
        ...prev,
        licenseFile: validation.error
      }));
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: validation.error
      });
      e.target.value = ''; // Reset file input
      return;
    }

    setFieldErrors(prev => ({
      ...prev,
      licenseFile: ''
    }));

    setFormData({
      ...formData,
      operator: { ...formData.operator, licenseFile: file },
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">Operator Information</h2>
      
      <div className="space-y-6">
        <OperatorBasicInfo formData={formData} setFormData={setFormData} />
        <OperatorIdentifier formData={formData} setFormData={setFormData} />
        <OperatorContact formData={formData} setFormData={setFormData} />
        <OperatorDetails formData={formData} setFormData={setFormData} />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Driver's License</Label>
            <Input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className={fieldErrors.licenseFile ? 'border-red-500' : ''}
            />
            {fieldErrors.licenseFile && (
              <p className="text-sm text-red-500">{fieldErrors.licenseFile}</p>
            )}
          </div>

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
    </div>
  );
};

export default StepFive;
