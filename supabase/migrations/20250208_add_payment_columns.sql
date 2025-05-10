-- Add payment tracking columns to storage_requests table
ALTER TABLE storage_requests
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for faster payment status lookups
CREATE INDEX IF NOT EXISTS storage_requests_payment_status_idx ON storage_requests(payment_status);

-- Add bank details columns to farmers table if not exists
ALTER TABLE farmers
ADD COLUMN IF NOT EXISTS bank_account TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ifsc_code TEXT DEFAULT NULL;