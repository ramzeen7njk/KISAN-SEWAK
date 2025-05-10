-- Add missing columns to farmers table
ALTER TABLE farmers
ADD COLUMN IF NOT EXISTS district text,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS aadhar_number text,
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS mobile text,
ADD COLUMN IF NOT EXISTS crops_cultivated text[],
ADD COLUMN IF NOT EXISTS land_acres numeric,
ADD COLUMN IF NOT EXISTS passbook_number text,
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS annual_income numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Add constraints
ALTER TABLE farmers
ADD CONSTRAINT farmers_mobile_unique UNIQUE (mobile),
ADD CONSTRAINT farmers_aadhar_number_unique UNIQUE (aadhar_number),
ADD CONSTRAINT farmers_passbook_number_unique UNIQUE (passbook_number);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS farmers_district_idx ON farmers(district);
CREATE INDEX IF NOT EXISTS farmers_state_idx ON farmers(state);
CREATE INDEX IF NOT EXISTS farmers_mobile_idx ON farmers(mobile);
CREATE INDEX IF NOT EXISTS farmers_passbook_number_idx ON farmers(passbook_number);
