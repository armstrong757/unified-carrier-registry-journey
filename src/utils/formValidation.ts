
import { z } from "zod";

// Format phone number as user types
export const formatPhoneNumber = (value: string) => {
  // Remove all non-numeric characters
  const cleaned = value.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length >= 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  } else if (cleaned.length > 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length > 3) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else if (cleaned.length > 0) {
    return `(${cleaned}`;
  }
  return cleaned;
};

// Format card number as user types
export const formatCardNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(' ').substr(0, 19); // 16 digits + 3 spaces
};

// Format expiry date as user types
export const formatExpiryDate = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
  }
  return cleaned;
};

// Format EIN (XX-XXXXXXX)
export const formatEIN = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length > 2) {
    return cleaned.slice(0, 2) + '-' + cleaned.slice(2, 9);
  }
  return cleaned;
};

// Format SSN (XXX-XX-XXXX)
export const formatSSN = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length > 5) {
    return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 5) + '-' + cleaned.slice(5, 9);
  } else if (cleaned.length > 3) {
    return cleaned.slice(0, 3) + '-' + cleaned.slice(3);
  }
  return cleaned;
};

// Validation schemas
export const formValidationSchema = {
  email: z.string().email("Invalid email address"),
  phone: z.string().min(14, "Phone number must be complete").max(14),
  ein: z.string().min(10, "EIN must be complete").max(10),
  ssn: z.string().min(11, "SSN must be complete").max(11),
  cardNumber: z.string().min(19, "Card number must be complete").max(19),
  expiryDate: z.string()
    .min(5, "Expiry date must be complete")
    .max(5)
    .refine((val) => {
      const [month, year] = val.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const numMonth = parseInt(month);
      const numYear = parseInt(year);
      
      return numMonth <= 12 && numMonth > 0 && 
             ((numYear > currentYear) || 
              (numYear === currentYear && numMonth >= currentMonth));
    }, "Invalid expiry date"),
  cvv: z.string().min(3, "CVV must be 3 digits").max(3),
};

export const validateField = (field: keyof typeof formValidationSchema, value: string) => {
  try {
    formValidationSchema[field].parse(value);
    return { valid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: "Invalid input" };
  }
};
