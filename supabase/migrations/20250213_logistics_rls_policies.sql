-- Drop existing policies if any
DROP POLICY IF EXISTS "logistics_insert_policy" ON logistics;
DROP POLICY IF EXISTS "logistics_select_policy" ON logistics;
DROP POLICY IF EXISTS "logistics_update_policy" ON logistics;

-- Ensure proper data types
ALTER TABLE logistics
  ALTER COLUMN company_name SET DATA TYPE text,
  ALTER COLUMN license_number SET DATA TYPE text,
  ALTER COLUMN name SET DATA TYPE text,
  ALTER COLUMN mobile SET DATA TYPE text,
  ALTER COLUMN state SET DATA TYPE text,
  ALTER COLUMN region SET DATA TYPE text,
  ALTER COLUMN logistics_type SET DATA TYPE text,
  ALTER COLUMN verification_status SET DATA TYPE text;

-- Enable Row Level Security
ALTER TABLE logistics ENABLE ROW LEVEL SECURITY;

-- Create insert policy for signup
CREATE POLICY "logistics_insert_policy" ON logistics
  FOR INSERT
  WITH CHECK (true);

-- Create select policy for login verification and data access
CREATE POLICY "logistics_select_policy" ON logistics
  FOR SELECT
  USING (
    -- Allow access for login verification when not authenticated
    (auth.uid() IS NULL AND true)
    OR
    -- Allow access to own records when authenticated
    (auth.uid() IS NOT NULL AND id = auth.uid())
  );

-- Create policy for logistics to view orders
CREATE POLICY "logistics_orders_select_policy" ON logistics_orders
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM logistics
      WHERE id = logistics_orders.logistics_company_id
    )
  );

-- Create update policy for authenticated logistics users
CREATE POLICY "logistics_update_policy" ON logistics
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());