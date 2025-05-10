export interface FarmerData {
  id: string;
  name: string;
  state?: string;
  district?: string;
  selected_district?: string;
  crops_cultivated?: string[];
  land_acres: number;
  phone?: string;
  email?: string;
  bank_account?: string;
  ifsc_code?: string;
  aadhar_number?: string;
  created_at?: string;
  updated_at?: string;
}

export type FarmerProfile = FarmerData;
