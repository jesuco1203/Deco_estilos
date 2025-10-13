-- Delete existing policies that target anon/public for the products bucket
DROP POLICY IF EXISTS "allow anon insert products" ON storage.objects;
DROP POLICY IF EXISTS "allow anon select products" ON storage.objects;
DROP POLICY IF EXISTS "allow anon update products" ON storage.objects;

DROP POLICY IF EXISTS "allow public insert products" ON storage.objects;
DROP POLICY IF EXISTS "allow public select products" ON storage.objects;
DROP POLICY IF EXISTS "allow public update products" ON storage.objects;

-- Recreate policies granting insert/select/update to the public role
CREATE POLICY "allow public insert products"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'products');

CREATE POLICY "allow public select products"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'products');

CREATE POLICY "allow public update products"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');
