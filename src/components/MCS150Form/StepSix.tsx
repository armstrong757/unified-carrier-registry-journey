import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface StepSixProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepSix = ({ formData, setFormData }: StepSixProps) => {
  const updateBilling = (field: string, value: any) => {
    setFormData({
      ...formData,
      billing: {
        ...formData.billing,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary">Billing Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">
                Card Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.billing.cardNumber}
                onChange={(e) => updateBilling("cardNumber", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">
                  Expiry Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.billing.expiryDate}
                  onChange={(e) => updateBilling("expiryDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">
                  CVV <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.billing.cvv}
                  onChange={(e) => updateBilling("cvv", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">
                Name on Card <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={formData.billing.cardName}
                onChange={(e) => updateBilling("cardName", e.target.value)}
              />
            </div>

            <div className="flex items-start space-x-2 pt-4">
              <Checkbox
                id="terms"
                checked={formData.billing.termsAccepted}
                onCheckedChange={(checked) => updateBilling("termsAccepted", checked)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm leading-normal">
                I agree to the terms, privacy policy, and refund policy{" "}
                <span className="text-red-500">*</span>
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold text-primary mb-4">Order Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Filing Fee:</span>
                <span className="text-sm">$10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Processing Fee:</span>
                <span className="text-sm">$5</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-600 text-sm">Total Cost:</span>
                <span className="text-sm">$15</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StepSix;
