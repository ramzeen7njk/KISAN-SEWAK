-- Drop foreign key constraints first
ALTER TABLE IF EXISTS crop_allocations
  DROP CONSTRAINT IF EXISTS crop_allocations_storage_facility_id_fkey;

ALTER TABLE IF EXISTS storage_inventory
  DROP CONSTRAINT IF EXISTS storage_inventory_facility_id_fkey;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS storage_requests;
DROP TABLE IF EXISTS storage_facilities;

-- Drop columns from crop_allocations if they exist
ALTER TABLE IF EXISTS crop_allocations
  DROP COLUMN IF EXISTS harvest_date,
  DROP COLUMN IF EXISTS expiry_date,
  DROP COLUMN IF EXISTS is_area_free;

-- Add harvest details columns to crop_allocations table
ALTER TABLE crop_allocations
ADD COLUMN IF NOT EXISTS harvest_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS expiry_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS is_area_free boolean DEFAULT false;

-- Create storage_facilities table
CREATE TABLE IF NOT EXISTS storage_facilities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  capacity DECIMAL NOT NULL,
  available_space DECIMAL NOT NULL,
  status TEXT DEFAULT 'active'
);

-- Create storage_requests table
CREATE TABLE IF NOT EXISTS storage_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  farmer_id uuid REFERENCES farmers(id),
  storage_facility_id uuid REFERENCES storage_facilities(id),
  crop_type TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- Enable RLS for storage_facilities
ALTER TABLE storage_facilities ENABLE ROW LEVEL SECURITY;

-- Create policy for storage_facilities
DROP POLICY IF EXISTS "Everyone can view storage facilities" ON storage_facilities;
CREATE POLICY "Everyone can view storage facilities"
  ON storage_facilities
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Enable RLS for storage_requests
ALTER TABLE storage_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for storage_requests
DROP POLICY IF EXISTS "Users can view their own storage requests" ON storage_requests;
CREATE POLICY "Users can view their own storage requests"
  ON storage_requests
  FOR ALL
  USING (auth.uid() = farmer_id);
