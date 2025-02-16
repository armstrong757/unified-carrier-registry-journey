import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import SignaturePad from "./SignaturePad";
import { useState } from "react";
interface StepFiveProps {
  formData: any;
  setFormData: (data: any) => void;
}
const StepFive = ({
  formData,
  setFormData
}: StepFiveProps) => {
  const {
    toast
  } = useToast();
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const updateOperator = (field: string, value: string) => {
    setFormData({
      ...formData,
      operator: {
        ...formData.operator,
        [field]: value
      }
    });
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedFileName(file.name);
      setFormData({
        ...formData,
        operator: {
          ...formData.operator,
          licenseFile: file
        }
      });
    }
  };
  return <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">Operator Information</h2>
      <p className="text-gray-600">Who is creating this update?</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input id="firstName" value={formData.operator.firstName} onChange={e => updateOperator("firstName", e.target.value)} placeholder="Enter first name" className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input id="lastName" value={formData.operator.lastName} onChange={e => updateOperator("lastName", e.target.value)} placeholder="Enter last name" className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input id="title" value={formData.operator.title} onChange={e => updateOperator("title", e.target.value)} placeholder="Enter job title" className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input id="email" type="email" value={formData.operator.email} onChange={e => updateOperator("email", e.target.value)} placeholder="Enter email address" className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone <span className="text-red-500">*</span>
          </Label>
          <Input id="phone" type="tel" value={formData.operator.phone} onChange={e => updateOperator("phone", e.target.value)} placeholder="Enter phone number" className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="einSsn">
            EIN/SSN <span className="text-red-500">*</span>
          </Label>
          <Input id="einSsn" value={formData.operator.einSsn} onChange={e => updateOperator("einSsn", e.target.value)} placeholder="Enter EIN or SSN" className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="milesDriven">
            Miles driven in the last 12 months <span className="text-red-500">*</span>
          </Label>
          <Input id="milesDriven" type="number" min="0" value={formData.operator.milesDriven} onChange={e => updateOperator("milesDriven", e.target.value)} placeholder="Enter miles driven" className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="licenseFile">
            Upload Driver License <span className="text-red-500">*</span>
          </Label>
          <div className="relative flex items-center w-full h-10">
            <label htmlFor="licenseFile" className="inline-flex items-center px-4 h-full bg-gray-50 rounded-l border border-input cursor-pointer hover:bg-gray-100 transition-colors text-muted-foreground text-sm md:text-sm">
              Choose File
            </label>
            <div className="flex-1 px-3 h-full flex items-center border border-l-0 border-input rounded-r truncate">
              {selectedFileName || ""}
            </div>
            <Input id="licenseFile" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="sr-only" />
          </div>
          <p className="text-sm text-gray-500">Upload a copy of your license (pdf, jpg, png)</p>
        </div>

        <div className="space-y-2 col-span-1 sm:col-span-2">
          <Label htmlFor="signature">
            Signature <span className="text-red-500">*</span>
          </Label>
          <div className="w-full sm:w-1/2">
            <SignaturePad onChange={signatureData => updateOperator("signature", signatureData)} />
          </div>
        </div>
      </div>
    </div>;
};
export default StepFive;