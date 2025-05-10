-- Drop existing policies
DROP POLICY IF EXISTS "Marketplaces can view their own data" ON marketplaces;
DROP POLICY IF EXISTS "marketplace_insert_policy" ON marketplaces;
DROP POLICY IF EXISTS "marketplace_select_policy" ON marketplaces;
DROP POLICY IF EXISTS "marketplace_update_policy" ON marketplaces;

-- Enable RLS
ALTER TABLE marketplaces ENABLE ROW LEVEL SECURITY;

-- Create policies for marketplaces table
CREATE POLICY "marketplace_insert_policy" ON marketplaces
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "marketplace_select_policy" ON marketplaces
  FOR SELECT
  USING (
    -- Allow access for login verification when not authenticated
    (auth.uid() IS NULL AND true)
    OR
    -- Allow access to own records when authenticated
    (auth.uid() IS NOT NULL AND id = auth.uid())
  );

CREATE POLICY "marketplace_update_policy" ON marketplaces
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Grant necessary permissions
GRANT ALL ON marketplaces TO authenticated;
GRANT ALL ON marketplaces TO anon;
GRANT ALL ON marketplaces TO service_role; 