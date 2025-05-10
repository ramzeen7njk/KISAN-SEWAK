-- Create marketplace_orders table
CREATE TABLE IF NOT EXISTS marketplace_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    marketplace_id UUID REFERENCES auth.users(id),
    marketplace_name TEXT NOT NULL,
    crop_type TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    quantity DECIMAL NOT NULL,
    base_price DECIMAL NOT NULL,
    transport_charge DECIMAL NOT NULL,
    gst DECIMAL NOT NULL,
    total_price DECIMAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create function to create marketplace_orders table
CREATE OR REPLACE FUNCTION create_marketplace_orders_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS marketplace_orders (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        marketplace_id UUID REFERENCES auth.users(id),
        marketplace_name TEXT NOT NULL,
        crop_type TEXT NOT NULL,
        crop_name TEXT NOT NULL,
        quantity DECIMAL NOT NULL,
        base_price DECIMAL NOT NULL,
        transport_charge DECIMAL NOT NULL,
        gst DECIMAL NOT NULL,
        total_price DECIMAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
    );
END;
$$; 