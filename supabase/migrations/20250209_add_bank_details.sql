-- Add bank details columns to logistics table if not exists
ALTER TABLE logistics
ADD COLUMN IF NOT EXISTS bank_name TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS bank_account TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ifsc_code TEXT DEFAULT NULL;

-- Add bank details columns to marketplace table if not exists
ALTER TABLE marketplace
ADD COLUMN IF NOT EXISTS bank_name TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS bank_account TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ifsc_code TEXT DEFAULT NULL;

-- Add bank name column to farmers table if not exists
ALTER TABLE farmers
ADD COLUMN IF NOT EXISTS bank_name TEXT DEFAULT NULL;