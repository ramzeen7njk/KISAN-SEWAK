export interface StorageFacility {
  id: string;
  created_at: string;
  name: string;
  state: string;
  district: string;
  capacity: number;
  current_stock: number;
  available_space: number;
  created_by: string;
  status: 'active' | 'inactive';
}

export interface StorageInventory {
  id: string;
  facility_id: string;
  crop_type: string;
  quantity: number;
  updated_at: string;
  created_at: string;
}
