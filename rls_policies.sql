-- Enable RLS on the wishlists table if not already enabled
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow individual read access" ON wishlists;
DROP POLICY IF EXISTS "Allow individual insert access" ON wishlists;
DROP POLICY IF EXISTS "Allow individual update access" ON wishlists;
DROP POLICY IF EXISTS "Allow individual delete access" ON wishlists;

-- Helper function to get contact_id from headers
CREATE OR REPLACE FUNCTION get_contact_id_from_headers()
RETURNS UUID AS $$
DECLARE
  contact_id_text TEXT;
BEGIN
  contact_id_text := current_setting('request.headers', true)::jsonb ->> 'x-contact-id';
  IF contact_id_text IS NULL THEN
    RETURN NULL;
  ELSE
    RETURN contact_id_text::uuid;
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- Helper function to get anon_id from headers
CREATE OR REPLACE FUNCTION get_anon_id_from_headers()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('request.headers', true)::jsonb ->> 'x-anon-id';
END;
$$ LANGUAGE plpgsql STABLE;


-- Policy: Allow users to see their own wishlist
CREATE POLICY "Allow individual read access" ON wishlists
FOR SELECT USING (
  (contact_id IS NOT NULL AND contact_id = get_contact_id_from_headers()) OR
  (anon_id IS NOT NULL AND anon_id = get_anon_id_from_headers())
);

-- Policy: Allow users to create their own wishlist
CREATE POLICY "Allow individual insert access" ON wishlists
FOR INSERT WITH CHECK (
  (contact_id IS NOT NULL AND contact_id = get_contact_id_from_headers()) OR
  (anon_id IS NOT NULL AND anon_id = get_anon_id_from_headers())
);

-- Policy: Allow users to update their own wishlist
CREATE POLICY "Allow individual update access" ON wishlists
FOR UPDATE USING (
  (contact_id IS NOT NULL AND contact_id = get_contact_id_from_headers()) OR
  (anon_id IS NOT NULL AND anon_id = get_anon_id_from_headers())
);

-- Policy: Allow users to delete their own wishlist
CREATE POLICY "Allow individual delete access" ON wishlists
FOR DELETE USING (
  (contact_id IS NOT NULL AND contact_id = get_contact_id_from_headers()) OR
  (anon_id IS NOT NULL AND anon_id = get_anon_id_from_headers())
);
