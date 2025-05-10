-- Modify the foreign key constraint in storage_requests table
ALTER TABLE storage_requests
DROP CONSTRAINT IF EXISTS storage_requests_storage_facility_id_fkey;

-- Add the foreign key constraint with ON DELETE CASCADE
ALTER TABLE storage_requests
ADD CONSTRAINT storage_requests_storage_facility_id_fkey
FOREIGN KEY (storage_facility_id)
REFERENCES storage_facilities(id)
ON DELETE CASCADE;

-- Modify the foreign key constraint in storage_inventory table
ALTER TABLE storage_inventory
DROP CONSTRAINT IF EXISTS storage_inventory_facility_id_fkey;

-- Add the foreign key constraint with ON DELETE CASCADE
ALTER TABLE storage_inventory
ADD CONSTRAINT storage_inventory_facility_id_fkey
FOREIGN KEY (facility_id)
REFERENCES storage_facilities(id)
ON DELETE CASCADE;