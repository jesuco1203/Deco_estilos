CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id bigint REFERENCES products(id),
  storage_key text,
  mime text,
  width int,
  height int,
  size_bytes int,
  variants jsonb,
  alt text,
  created_at timestamptz DEFAULT now()
);
