-- Cambiar las políticas existentes de anon → public
ALTER POLICY "allow anon insert products"
ON storage.objects
TO public;

ALTER POLICY "allow anon select products"
ON storage.objects
TO public;

ALTER POLICY "allow anon update products"
ON storage.objects
TO public;

-- Renombrar las políticas para mayor claridad
ALTER POLICY "allow anon insert products"
ON storage.objects RENAME TO "allow public insert products";

ALTER POLICY "allow anon select products"
ON storage.objects RENAME TO "allow public select products";

ALTER POLICY "allow anon update products"
ON storage.objects RENAME TO "allow public update products";
