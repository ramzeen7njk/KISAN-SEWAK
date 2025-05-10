export interface User {
  id: string;
  created_at: string;
  user_type: 'farmer' | 'marketplace' | 'logistics' | 'admin';
  name: string;
  age: number;
  mobile: string;
  state: string;
  region: string;
}

export interface Farmer extends User {
  passbook_number: string;
  crops_cultivated: string[];
  land_acres: number;
  aadhar_number: string;
}

export interface Marketplace extends User {
  company_type: 'ration' | 'corporation' | 'restaurant' | 'hotel' | 'wholesale' | 'retail' | 'contract';
  company_name: string;
  iso_number: string;
  verification_status: 'pending' | 'verified' | 'rejected';
}

export interface Logistics extends User {
  company_name: string;
  logistics_type: string;
  quantity_available: number;
  license_number: string;
}

export interface Admin extends User {
  username: string;
  password: string;
}