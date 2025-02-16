
export type FilingType = 'ucr' | 'mcs150';

export interface Filing {
  id: string;
  usdot_number: string;
  filing_type: FilingType;
  form_data: any;
  status: 'draft' | 'completed';
  completed_at?: string;
  created_at: string;
  updated_at: string;
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
