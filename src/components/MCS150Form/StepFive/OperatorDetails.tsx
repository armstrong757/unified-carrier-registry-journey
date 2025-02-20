
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface OperatorDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  fieldErrors?: Record<string, string>;
}

const OperatorDetails = ({ formData, setFormData, fieldErrors }: OperatorDetailsProps) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      operator: { ...formData.operator, licenseFile: file },
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <Label>Driver's License</Label>
        <Input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
          className={fieldErrors?.licenseFile ? 'border-red-500' : ''}
        />
        {fieldErrors?.licenseFile && (
          <p className="text-sm text-red-500">{fieldErrors.licenseFile}</p>
        )}
      </div>
    </div>
  );
};

export default OperatorDetails;
