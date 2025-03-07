
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadIcon } from "lucide-react";

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

  const handleUploadClick = () => {
    document.getElementById('licenseFile')?.click();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleUploadClick();
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
        <Label htmlFor="licenseFileUpload">
          Driver's License <span className="text-red-500">*</span>
        </Label>
        <div 
          id="licenseFileUpload"
          role="button"
          tabIndex={0}
          className={`relative border border-dashed rounded-md h-10 px-4 flex items-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors ${fieldErrors?.licenseFile ? 'border-red-500' : 'border-gray-300'}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          onKeyDown={handleKeyPress}
        >
          <UploadIcon className="h-4 w-4 stroke-1 text-gray-400" />
          <div className="text-sm font-normal text-gray-600 ml-2">
            {formData.operator?.licenseFile 
              ? formData.operator.licenseFile.name 
              : "Upload File"}
          </div>
          <Input
            id="licenseFile"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
        {fieldErrors?.licenseFile && (
          <p className="text-sm text-red-500">{fieldErrors.licenseFile}</p>
        )}
      </div>
    </div>
  );
};

export default OperatorDetails;
