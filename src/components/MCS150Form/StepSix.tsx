
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCardNumber, formatExpiryDate, validateField } from "@/utils/formValidation";

interface StepSixProps {
  formData: any;
  setFormData: (data: any) => void;
}

const StepSix = ({ formData, setFormData }: StepSixProps) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateBilling = (field: string, value: any) => {
    setFormData({
      ...formData,
      billing: {
        ...formData.billing,
        [field]: value,
      },
    });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    updateBilling("cardNumber", formatted);
    
    if (formatted.length === 19) {
      const validation = validateField('cardNumber', formatted);
      setFieldErrors(prev => ({ ...prev, cardNumber: validation.error || '' }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    updateBilling("expiryDate", formatted);
    
    if (formatted.length === 5) {
      const [month, year] = formatted.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const numMonth = parseInt(month);
      const numYear = parseInt(year);
      
      let error = '';
      if (numMonth > 12 || numMonth < 1) {
        error = 'Invalid month';
      } else if (numYear < currentYear || (numYear === currentYear && numMonth < currentMonth)) {
        error = 'Card has expired';
      }
      
      setFieldErrors(prev => ({ ...prev, expiryDate: error }));
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    updateBilling("cvv", value);
    
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Method <span className="text-red-500">*</span></Label>
                <RadioGroup
                  value={formData.billing?.paymentMethod || 'credit'}
                  onValueChange={(value) => updateBilling("paymentMethod", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit">Credit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="debit" id="debit" />
                    <Label htmlFor="debit">Debit Card</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">
                  Card Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.billing?.cardNumber || ''}
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
                    value={formData.billing?.expiryDate || ''}
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
                    value={formData.billing?.cvv || ''}
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
                  value={formData.billing?.cardName || ''}
                  onChange={(e) => updateBilling("cardName", e.target.value)}
                />
              </div>

              <div className="flex items-start space-x-2 pt-4">
                <Checkbox
                  id="terms"
                  checked={formData.billing?.termsAccepted || false}
                  onCheckedChange={(checked) => updateBilling("termsAccepted", checked)}
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold text-primary mb-4">Order Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Filing Fee:</span>
                <span className="text-sm font-semibold">$149.00</span>
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

export default StepSix;
