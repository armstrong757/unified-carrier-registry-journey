
export type FilingType = 'ucr' | 'mcs150';

export interface MCS150FormData {
  companyName?: string;
  businessPhone?: string;
  principalAddress?: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  // Add other form fields as needed
}

export interface UCRFormData {
  representative?: string;
  phone?: string;
  // Add other form fields as needed
}

export interface USDOTData {
  usdotNumber: string;
  legalName?: string;
  dbaName?: string;
  mailingAddress?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phoneNumber?: string;
  emailAddress?: string;
  operatingStatus?: string;
  outOfServiceDate?: string | null;
  mcs150FormDate?: string | null;
  entityType?: string;
  carrierOperation?: string;
  cargoCarried?: string[];
}

export interface Filing {
  id: string;
  usdot_number: string;
  filing_type: FilingType;
  form_data: MCS150FormData | UCRFormData;
  status: 'draft' | 'completed';
  completed_at?: string;
  created_at: string;
  updated_at: string;
  abandoned_cart_email_sent: boolean;
}

export interface Transaction {
  id: string;
  filing_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  created_at: string;
  updated_at: string;
}
