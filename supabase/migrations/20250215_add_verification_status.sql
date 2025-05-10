-- Add verification_status column to marketplaces table
ALTER TABLE marketplaces
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';

-- Create index for faster verification status lookups
CREATE INDEX IF NOT EXISTS marketplaces_verification_status_idx ON marketplaces(verification_status); 