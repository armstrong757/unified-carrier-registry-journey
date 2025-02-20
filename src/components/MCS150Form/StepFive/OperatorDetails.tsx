
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CloudIcon } from "lucide-react";

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        operator: { ...formData.operator, licenseFile: file },
      });
    }
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
        <Label>Driver's License <span className="text-red-500">*</span></Label>
        <div 
          className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-gray-400 transition-colors ${fieldErrors?.licenseFile ? 'border-red-500' : 'border-gray-300'}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('licenseFile')?.click()}
        >
          <CloudIcon className="h-8 w-8 text-gray-400 mb-2" />
          <div className="text-sm font-medium text-gray-700">Browse Files</div>
          <div className="text-xs text-gray-500 mt-1">Drag and drop files here</div>
          <Input
            id="licenseFile"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />
          {formData.operator?.licenseFile && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {formData.operator.licenseFile.name}
            </div>
          )}
        </div>
        {fieldErrors?.licenseFile && (
          <p className="text-sm text-red-500">{fieldErrors.licenseFile}</p>
        )}
      </div>
    </div>
  );
};

export default OperatorDetails;
