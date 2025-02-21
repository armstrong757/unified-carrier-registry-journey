export type FilingType = 'ucr' | 'mcs150';

export interface MCS150FormData {
  reasonForFiling: string;
  hasChanges: 'yes' | 'no';
  changesToMake: {
    companyInfo?: boolean;
    operatingInfo?: boolean;
    other?: boolean;
  };
  companyInfoChanges: {
    ownerName?: boolean;
    address?: boolean;
    phone?: boolean;
    email?: boolean;
    companyName?: boolean;
    einSsn?: boolean;
  };
  operatingInfoChanges: {
    vehicles?: boolean;
    drivers?: boolean;
    operations?: boolean;
    classifications?: boolean;
    cargo?: boolean;
    hazmat?: boolean;
  };
  operator?: {
    firstName?: string;
    lastName?: string;
    title?: string;
    email?: string;
    phone?: string;
    identifierType?: 'ein' | 'ssn';
    einSsn?: string;
    milesDriven?: string;
    licenseFile?: File | null;
    signature?: string;
  };
  // Company Information fields
  companyName?: string;
  businessPhone?: string;
  principalAddress?: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

export interface UCRFormData {
  representative?: string;
  phone?: string;
  // Add other form fields as needed
}

export interface USDOTData {
  usdotNumber: string;
  legalName: string;
  dbaName?: string;
  operatingStatus?: string;
  entityType?: string;
  physicalAddress?: string;
  telephone?: string;
  powerUnits?: number;
  drivers?: number;
  busCount?: number;
  limoCount?: number;
  minibusCount?: number;
  motorcoachCount?: number;
  vanCount?: number;
  complaintCount?: number;
  outOfService?: boolean;
  outOfServiceDate?: string | null;
  mcNumber?: string;
  mcs150FormDate?: string | null;
  mcs150Date?: string | null;
  mcs150Year?: number;
  mcs150Mileage?: number;
  carrierOperation?: string;
  cargoCarried?: string[];
  insuranceBIPD?: number;
  insuranceBond?: number;
  insuranceCargo?: number;
  riskScore?: string;
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
