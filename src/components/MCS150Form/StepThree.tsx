
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface StepThreeProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepThree = ({ formData, setFormData }: StepThreeProps) => {
  const updatePrincipalAddress = (field: string, value: string) => {
    setFormData({
      ...formData,
      principalAddress: {
        ...formData.principalAddress,
        [field]: value,
      },
    });
  };

  const updateMailingAddress = (field: string, value: string) => {
    setFormData({
      ...formData,
      mailingAddress: {
        ...formData.mailingAddress,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">Company Information</h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="ownerName">
            Owner's Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ownerName"
            value={formData.ownerName}
            onChange={(e) =>
              setFormData({ ...formData, ownerName: e.target.value })
            }
            placeholder="Full Name"
          />
        </div>

        <div className="space-y-4">
          <Label>
            Principal Place of Business <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Address"
              value={formData.principalAddress.address}
              onChange={(e) => updatePrincipalAddress("address", e.target.value)}
            />
            <Input
              placeholder="City"
              value={formData.principalAddress.city}
              onChange={(e) => updatePrincipalAddress("city", e.target.value)}
            />
            <Input
              placeholder="State"
              value={formData.principalAddress.state}
              onChange={(e) => updatePrincipalAddress("state", e.target.value)}
            />
            <Input
              placeholder="ZIP Code"
              value={formData.principalAddress.zip}
              onChange={(e) => updatePrincipalAddress("zip", e.target.value)}
            />
            <Input
              placeholder="Country"
              value={formData.principalAddress.country}
              onChange={(e) => updatePrincipalAddress("country", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>
            Company Mailing Address <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Address"
              value={formData.mailingAddress.address}
              onChange={(e) => updateMailingAddress("address", e.target.value)}
            />
            <Input
              placeholder="City"
              value={formData.mailingAddress.city}
              onChange={(e) => updateMailingAddress("city", e.target.value)}
            />
            <Input
              placeholder="State"
              value={formData.mailingAddress.state}
              onChange={(e) => updateMailingAddress("state", e.target.value)}
            />
            <Input
              placeholder="ZIP Code"
              value={formData.mailingAddress.zip}
              onChange={(e) => updateMailingAddress("zip", e.target.value)}
            />
            <Input
              placeholder="Country"
              value={formData.mailingAddress.country}
              onChange={(e) => updateMailingAddress("country", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessPhone">
              Business Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="businessPhone"
              value={formData.businessPhone}
              onChange={(e) =>
                setFormData({ ...formData, businessPhone: e.target.value })
              }
              placeholder="Phone Number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessEmail">
              Business Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="businessEmail"
              type="email"
              value={formData.businessEmail}
              onChange={(e) =>
                setFormData({ ...formData, businessEmail: e.target.value })
              }
              placeholder="Email Address"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              placeholder="Company Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="einSsn">
              EIN or SSN Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="einSsn"
              value={formData.einSsn}
              onChange={(e) =>
                setFormData({ ...formData, einSsn: e.target.value })
              }
              placeholder="EIN/SSN"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
