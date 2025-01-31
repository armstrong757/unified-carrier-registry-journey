import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface StepTwoProps {
  formData: any;
  setFormData: (data: any) => void;
}

const classifications = [
  { id: "motorCarrier", label: "Motor Carrier (For Hire)" },
  { id: "motorPrivate", label: "Motor Private Carrier (Not For Hire)" },
  { id: "freightForwarder", label: "Freight Forwarder" },
  { id: "broker", label: "Broker" },
  { id: "leasingCompany", label: "Leasing Company" },
];

const StepTwo = ({ formData, setFormData }: StepTwoProps) => {
  const toggleClassification = (id: string) => {
    setFormData({
      ...formData,
      classifications: {
        ...formData.classifications,
        [id]: !formData.classifications[id],
      },
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">Classification</h2>

      <div className="space-y-4">
        <Label>
          Carrier Classification (check all that apply){" "}
          <span className="text-red-500">*</span>
        </Label>
        {classifications.map(({ id, label }) => (
          <div key={id} className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={formData.classifications?.[id] || false}
              onCheckedChange={() => toggleClassification(id)}
            />
            <Label htmlFor={id}>{label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepTwo;