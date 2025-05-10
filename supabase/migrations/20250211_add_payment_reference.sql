-- Add payment reference column to storage_requests table
ALTER TABLE storage_requests
ADD COLUMN IF NOT EXISTS payment_reference TEXT DEFAULT NULL;

-- Create index for faster payment reference lookups
CREATE INDEX IF NOT EXISTS storage_requests_payment_reference_idx ON storage_requests(payment_reference);