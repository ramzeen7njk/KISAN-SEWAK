-- Create function to decrement available space in storage facilities
CREATE OR REPLACE FUNCTION decrement_available_space(facility_id uuid, quantity decimal)
RETURNS decimal
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_space decimal;
BEGIN
    -- Get current available space
    SELECT available_space INTO current_space
    FROM storage_facilities
    WHERE id = facility_id;

    -- Ensure we don't go below 0
    IF current_space - quantity < 0 THEN
        RAISE EXCEPTION 'Not enough available space in storage facility';
    END IF;

    -- Return new available space
    RETURN current_space - quantity;
END;
$$; 