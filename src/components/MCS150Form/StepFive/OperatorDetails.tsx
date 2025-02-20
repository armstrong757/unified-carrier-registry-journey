
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface OperatorDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
}

const OperatorDetails = ({ formData, setFormData }: OperatorDetailsProps) => {
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

  return (
    <>
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
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          value={formData.operator?.title || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              operator: { ...formData.operator, title: e.target.value },
            })
          }
          placeholder="Job Title"
        />
      </div>
    </>
  );
};

export default OperatorDetails;
