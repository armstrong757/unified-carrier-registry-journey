
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatEIN, formatSSN, formatPhoneNumber, validateField } from "@/utils/formValidation";
import { useState } from "react";

interface StepThreeProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepThree = ({ formData, setFormData }: StepThreeProps) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // If user selected "No changes" or didn't select company info changes, skip this step
  if (formData.hasChanges !== "yes" || !formData.changesToMake.companyInfo) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-primary">Company Information</h2>
        <p className="text-gray-600">
          No company information changes were selected. Click Next to continue.
        </p>
      </div>
    );
  }

  const handleCompanyIdentifierChange = (value: string) => {
    // Clear previous identifier value when switching types
    setFormData({
      ...formData,
      companyIdentifierType: value,
      companyIdentifier: ''
    });
    setFieldErrors({});
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const type = formData.companyIdentifierType;
    
    // Format based on type
    const formatted = type === 'ein' ? formatEIN(value) : formatSSN(value);
    
    setFormData({
      ...formData,
      companyIdentifier: formatted
    });

    // Validate if complete
    if ((type === 'ein' && formatted.length === 10) || 
        (type === 'ssn' && formatted.length === 11)) {
      const validation = validateField(type, formatted);
      setFieldErrors(prev => ({ ...prev, identifier: validation.error || '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, businessPhone: formatted });
    
    if (formatted.length === 14) {
      const validation = validateField('phone', formatted);
      setFieldErrors(prev => ({ ...prev, phone: validation.error || '' }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, businessEmail: value });
    
    const validation = validateField('email', value);
    setFieldErrors(prev => ({ ...prev, email: validation.error || '' }));
  };

  const updatePrincipalAddress = (field: string, value: string) => {
    setFormData({
      ...formData,
      principalAddress: {
        ...formData.principalAddress,
        [field]: value,
      },
      address_modified: true // Track that address was modified
    });
  };

  const updateMailingAddress = (field: string, value: string) => {
    setFormData({
      ...formData,
      mailingAddress: {
        ...formData.mailingAddress,
        [field]: value,
      },
      address_modified: true // Track that address was modified
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">Company Information</h2>

      <div className="space-y-6">
        {formData.companyInfoChanges.ownerName && (
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
        )}

        {formData.companyInfoChanges.einSsn && (
          <div className="space-y-4">
            <Label>
              Company Identifier Type <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.companyIdentifierType || 'ein'}
              onValueChange={handleCompanyIdentifierChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ein" id="ein" />
                <Label htmlFor="ein">Employer Identification Number (EIN)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ssn" id="ssn" />
                <Label htmlFor="ssn">Social Security Number (SSN)</Label>
              </div>
            </RadioGroup>
            
            <div className="space-y-2">
              <Label htmlFor="companyIdentifier">
                {formData.companyIdentifierType === 'ein' ? 'EIN' : 'SSN'}{' '}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyIdentifier"
                value={formData.companyIdentifier || ''}
                onChange={handleIdentifierChange}
                placeholder={formData.companyIdentifierType === 'ein' ? 'XX-XXXXXXX' : 'XXX-XX-XXXX'}
                maxLength={formData.companyIdentifierType === 'ein' ? 10 : 11}
                className={fieldErrors.identifier ? 'border-red-500' : ''}
              />
              {fieldErrors.identifier && (
                <p className="text-sm text-red-500">{fieldErrors.identifier}</p>
              )}
            </div>
          </div>
        )}

        {formData.companyInfoChanges.address && (
          <>
            <div className="space-y-4">
              <Label>
                Principal Place of Business <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Address"
                  value={formData.principalAddress?.address || ''}
                  onChange={(e) =>
                    updatePrincipalAddress("address", e.target.value)
                  }
                />
                <Input
                  placeholder="City"
                  value={formData.principalAddress?.city || ''}
                  onChange={(e) => updatePrincipalAddress("city", e.target.value)}
                />
                <Input
                  placeholder="State"
                  value={formData.principalAddress?.state || ''}
                  onChange={(e) => updatePrincipalAddress("state", e.target.value)}
                />
                <Input
                  placeholder="ZIP Code"
                  value={formData.principalAddress?.zip || ''}
                  onChange={(e) => updatePrincipalAddress("zip", e.target.value)}
                />
                <Input
                  placeholder="Country"
                  value={formData.principalAddress?.country || 'USA'}
                  onChange={(e) =>
                    updatePrincipalAddress("country", e.target.value)
                  }
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
                  value={formData.mailingAddress?.address || ''}
                  onChange={(e) => updateMailingAddress("address", e.target.value)}
                />
                <Input
                  placeholder="City"
                  value={formData.mailingAddress?.city || ''}
                  onChange={(e) => updateMailingAddress("city", e.target.value)}
                />
                <Input
                  placeholder="State"
                  value={formData.mailingAddress?.state || ''}
                  onChange={(e) => updateMailingAddress("state", e.target.value)}
                />
                <Input
                  placeholder="ZIP Code"
                  value={formData.mailingAddress?.zip || ''}
                  onChange={(e) => updateMailingAddress("zip", e.target.value)}
                />
                <Input
                  placeholder="Country"
                  value={formData.mailingAddress?.country || 'USA'}
                  onChange={(e) => updateMailingAddress("country", e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {formData.companyInfoChanges.phone && (
          <div className="space-y-2">
            <Label htmlFor="businessPhone">
              Business Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="businessPhone"
              value={formData.businessPhone || ''}
              onChange={handlePhoneChange}
              placeholder="(555) 555-5555"
              maxLength={14}
              className={fieldErrors.phone ? 'border-red-500' : ''}
            />
            {fieldErrors.phone && (
              <p className="text-sm text-red-500">{fieldErrors.phone}</p>
            )}
          </div>
        )}

        {formData.companyInfoChanges.email && (
          <div className="space-y-2">
            <Label htmlFor="businessEmail">
              Business Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="businessEmail"
              type="email"
              value={formData.businessEmail || ''}
              onChange={handleEmailChange}
              placeholder="email@example.com"
              className={fieldErrors.email ? 'border-red-500' : ''}
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-500">{fieldErrors.email}</p>
            )}
          </div>
        )}

        {formData.companyInfoChanges.companyName && (
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
        )}
      </div>
    </div>
  );
};

export default StepThree;
