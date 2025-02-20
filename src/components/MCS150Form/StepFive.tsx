
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import OperatorBasicInfo from "./StepFive/OperatorBasicInfo";
import OperatorIdentifier from "./StepFive/OperatorIdentifier";
import OperatorContact from "./StepFive/OperatorContact";
import OperatorDetails from "./StepFive/OperatorDetails";
import SignaturePad from "./SignaturePad";

interface StepFiveProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepFive = ({ formData, setFormData }: StepFiveProps) => {
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

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">Operator Information</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OperatorBasicInfo formData={formData} setFormData={setFormData} />
          <OperatorIdentifier formData={formData} setFormData={setFormData} />
          <OperatorContact formData={formData} setFormData={setFormData} />
          <OperatorDetails formData={formData} setFormData={setFormData} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <Label>Driver's License</Label>
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFormData({
                  ...formData,
                  operator: { ...formData.operator, licenseFile: file },
                });
              }}
              accept=".pdf,.jpg,.jpeg,.png"
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
    </div>
  );
};

export default StepFive;
