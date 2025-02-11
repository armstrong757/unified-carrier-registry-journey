
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface StepFiveProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepFive = ({ formData, setFormData }: StepFiveProps) => {
  const { toast } = useToast();

  const updateOperator = (field: string, value: string) => {
    setFormData({
      ...formData,
      operator: {
        ...formData.operator,
        [field]: value,
      },
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setFormData({
        ...formData,
        operator: {
          ...formData.operator,
          licenseFile: file,
        },
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">Operator Information</h2>
      <p className="text-gray-600">
        Please provide information about the person operating this vehicle.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            value={formData.operator.firstName}
            onChange={(e) => updateOperator("firstName", e.target.value)}
            placeholder="Enter first name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            value={formData.operator.lastName}
            onChange={(e) => updateOperator("lastName", e.target.value)}
            placeholder="Enter last name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={formData.operator.title}
            onChange={(e) => updateOperator("title", e.target.value)}
            placeholder="Enter job title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.operator.email}
            onChange={(e) => updateOperator("email", e.target.value)}
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.operator.phone}
            onChange={(e) => updateOperator("phone", e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="einSsn">
            EIN/SSN <span className="text-red-500">*</span>
          </Label>
          <Input
            id="einSsn"
            value={formData.operator.einSsn}
            onChange={(e) => updateOperator("einSsn", e.target.value)}
            placeholder="Enter EIN or SSN"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="milesDriven">
            Annual Miles Driven <span className="text-red-500">*</span>
          </Label>
          <Input
            id="milesDriven"
            type="number"
            min="0"
            value={formData.operator.milesDriven}
            onChange={(e) => updateOperator("milesDriven", e.target.value)}
            placeholder="Enter annual miles driven"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="licenseFile">
            Driver's License Copy <span className="text-red-500">*</span>
          </Label>
          <Input
            id="licenseFile"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
          <p className="text-sm text-gray-500">Upload a copy of your driver's license (PDF, JPG, PNG)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signature">
            Digital Signature <span className="text-red-500">*</span>
          </Label>
          <Input
            id="signature"
            value={formData.operator.signature}
            onChange={(e) => updateOperator("signature", e.target.value)}
            placeholder="Type your full name as signature"
          />
          <p className="text-sm text-gray-500">
            By typing your name, you agree that this represents your legal signature
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepFive;
