
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StepTwoProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepTwo = ({ formData, setFormData }: StepTwoProps) => {
  const updateChangesToMake = (key: string) => {
    setFormData({
      ...formData,
      changesToMake: {
        ...formData.changesToMake,
        [key]: !formData.changesToMake[key],
      },
    });
  };

  const updateCompanyInfoChanges = (key: string) => {
    setFormData({
      ...formData,
      companyInfoChanges: {
        ...formData.companyInfoChanges,
        [key]: !formData.companyInfoChanges[key],
      },
    });
  };

  const updateOperatingInfoChanges = (key: string) => {
    setFormData({
      ...formData,
      operatingInfoChanges: {
        ...formData.operatingInfoChanges,
        [key]: !formData.operatingInfoChanges[key],
      },
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">
        Biennial Update or Changes
      </h2>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label>
            Are there any changes you want to make on MCS-150?{" "}
            <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.hasChanges}
            onValueChange={(value) =>
              setFormData({ ...formData, hasChanges: value })
            }
            className="space-y-1.5"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="no" id="no-changes" className="mt-0.5" />
              <Label htmlFor="no-changes" className="text-sm">
                No, all the information is the same
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="yes" id="yes-changes" className="mt-0.5" />
              <Label htmlFor="yes-changes" className="text-sm">
                Yes, there are changes
              </Label>
            </div>
          </RadioGroup>
        </div>

        {formData.hasChanges === "yes" && (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="companyInfo"
                  checked={formData.changesToMake.companyInfo}
                  onCheckedChange={() => updateChangesToMake("companyInfo")}
                  className="mt-0.5"
                />
                <Label htmlFor="companyInfo" className="text-sm">
                  Company Information (Name, Address, Phone, Email, EIN)
                </Label>
              </div>

              {formData.changesToMake.companyInfo && (
                <div className="space-y-1.5 pl-6">
                  <Label className="text-sm">
                    Select all information you wish to change or update{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  {[
                    { id: "ownerName", label: "Owner's Name" },
                    { id: "address", label: "Address" },
                    { id: "phone", label: "Phone Number" },
                    { id: "email", label: "Email" },
                    { id: "companyName", label: "Company Name" },
                    { id: "einSsn", label: "EIN or SSN Number" },
                  ].map(({ id, label }) => (
                    <div key={id} className="flex items-start space-x-2">
                      <Checkbox
                        id={id}
                        checked={formData.companyInfoChanges[id]}
                        onCheckedChange={() => updateCompanyInfoChanges(id)}
                        className="mt-0.5"
                      />
                      <Label htmlFor={id} className="text-sm">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="operatingInfo"
                  checked={formData.changesToMake.operatingInfo}
                  onCheckedChange={() => updateChangesToMake("operatingInfo")}
                  className="mt-0.5"
                />
                <Label htmlFor="operatingInfo" className="text-sm">
                  Operating Information (Classifications, Vehicles, Drivers)
                </Label>
              </div>

              {formData.changesToMake.operatingInfo && (
                <div className="space-y-1.5 pl-6">
                  <Label className="text-sm">
                    Select all information you wish to change or update{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  {[
                    { id: "vehicles", label: "Number Of Vehicles" },
                    { id: "drivers", label: "Number Of Drivers" },
                    { id: "operations", label: "Company Operations" },
                    { id: "classifications", label: "Operation Classifications" },
                    { id: "cargo", label: "Cargo Classifications" },
                    { id: "hazmat", label: "Hazardous Materials" },
                  ].map(({ id, label }) => (
                    <div key={id} className="flex items-start space-x-2">
                      <Checkbox
                        id={id}
                        checked={formData.operatingInfoChanges[id]}
                        onCheckedChange={() => updateOperatingInfoChanges(id)}
                        className="mt-0.5"
                      />
                      <Label htmlFor={id} className="text-sm">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="other"
                checked={formData.changesToMake.other}
                onCheckedChange={() => updateChangesToMake("other")}
                className="mt-0.5"
              />
              <Label htmlFor="other" className="text-sm">
                Other
              </Label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepTwo;
