-- Drop existing table and constraints if they exist
DROP TABLE IF EXISTS storage_inventory CASCADE;

-- Create storage_inventory table
CREATE TABLE storage_inventory (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  facility_id uuid REFERENCES storage_facilities(id) ON DELETE CASCADE,
  crop_type TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS storage_inventory_facility_id_idx ON storage_inventory(facility_id);
CREATE INDEX IF NOT EXISTS storage_inventory_crop_type_idx ON storage_inventory(crop_type); 