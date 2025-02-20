import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { calculateUCRFee } from "@/utils/ucrFeeCalculator";
import { 
  formatCardNumber, 
  formatExpiryDate, 
  validateField 
} from "@/utils/formValidation";

interface StepFourProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepFour = ({ formData, setFormData }: StepFourProps) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  // Calculate total vehicles including adjustments
  const calculateTotalVehicles = () => {
    const straightTrucks = parseInt(String(formData.straightTrucks || '0').replace(/,/g, ''));
    const passengerVehicles = parseInt(String(formData.passengerVehicles || '0').replace(/,/g, ''));
    const addVehicles = formData.needsVehicleChanges === "yes" ? 
                       parseInt(String(formData.addVehicles || '0').replace(/,/g, '')) : 0;
    const excludeVehicles = formData.needsVehicleChanges === "yes" ? 
                          parseInt(String(formData.excludeVehicles || '0').replace(/,/g, '')) : 0;
    
    return straightTrucks + passengerVehicles + addVehicles - excludeVehicles;
  };

  const totalVehicles = calculateTotalVehicles();
  const ucrFee = calculateUCRFee(totalVehicles);
  const displayedFee = ucrFee === 0 ? "Contact Us" : `$${ucrFee.toFixed(2)}`;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData({ ...formData, cardNumber: formatted });
    
    if (formatted.length === 19) {
      const validation = validateField('cardNumber', formatted);
      setFieldErrors(prev => ({ ...prev, cardNumber: validation.error || '' }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData({ ...formData, expiryDate: formatted });
    
    if (formatted.length === 5) {
      const validation = validateField('expiryDate', formatted);
      setFieldErrors(prev => ({ ...prev, expiryDate: validation.error || '' }));
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setFormData({ ...formData, cvv: value });
    
    if (value.length === 3) {
      const validation = validateField('cvv', value);
      setFieldErrors(prev => ({ ...prev, cvv: validation.error || '' }));
    }
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
                value={formData.cardNumber || ''}
                onChange={handleCardNumberChange}
                maxLength={19}
                className={fieldErrors.cardNumber ? 'border-red-500' : ''}
              />
              {fieldErrors.cardNumber && (
                <p className="text-sm text-red-500">{fieldErrors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">
                  Expiry Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate || ''}
                  onChange={handleExpiryChange}
                  maxLength={5}
                  className={fieldErrors.expiryDate ? 'border-red-500' : ''}
                />
                {fieldErrors.expiryDate && (
                  <p className="text-sm text-red-500">{fieldErrors.expiryDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">
                  CVV <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv || ''}
                  onChange={handleCVVChange}
                  maxLength={3}
                  className={fieldErrors.cvv ? 'border-red-500' : ''}
                />
                {fieldErrors.cvv && (
                  <p className="text-sm text-red-500">{fieldErrors.cvv}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">
                Name on Card <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={formData.cardName || ''}
                onChange={(e) =>
                  setFormData({ ...formData, cardName: e.target.value })
                }
              />
            </div>

            <div className="flex items-start space-x-2 pt-4">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, termsAccepted: checked })
                }
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm leading-normal">
                I agree to the{" "}
                <a 
                  href="/terms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  terms
                </a>
                ,{" "}
                <a 
                  href="/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  privacy policy
                </a>
                , and{" "}
                <a 
                  href="/refund" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  refund policy
                </a>{" "}
                <span className="text-red-500">*</span>
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold text-primary mb-4">Order Details</h3>
            <div className="space-y-4">
              <div className="text-gray-600 text-sm">
                Total Vehicles: {totalVehicles.toLocaleString()}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Registration Fee:</span>
                <span className="text-sm font-semibold">{displayedFee}</span>
              </div>
              <p className="text-gray-500 text-[12px] italic">
                *Includes any required government fees and our charge for providing this service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StepFour;
