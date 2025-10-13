ALTER TABLE wishlists ADD COLUMN IF NOT EXISTS product_id int;
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists (product_id);
