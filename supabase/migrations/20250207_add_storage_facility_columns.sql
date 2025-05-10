-- Create storage_facilities table if not exists
CREATE TABLE IF NOT EXISTS storage_facilities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  capacity DECIMAL NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  available_space DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS storage_facilities_state_idx ON storage_facilities(state);
CREATE INDEX IF NOT EXISTS storage_facilities_district_idx ON storage_facilities(district);

-- Disable RLS for storage_facilities to allow unrestricted access
ALTER TABLE storage_facilities DISABLE ROW LEVEL SECURITY;