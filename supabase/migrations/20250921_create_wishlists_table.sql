-- Create the wishlists table
create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  anon_id text not null,
  contact_id uuid references contacts(id),
  product_id int not null,
  created_at timestamptz default now(),

  -- Add unique constraints to prevent duplicate entries
  constraint unique_anon_product unique (anon_id, product_id),
  constraint unique_contact_product unique (contact_id, product_id)
);

-- Add index for faster lookups
create index if not exists idx_wishlists_anon_id on wishlists (anon_id);
create index if not exists idx_wishlists_contact_id on wishlists (contact_id);
create index if not exists idx_wishlists_product_id on wishlists (product_id);

-- Enable Row Level Security (RLS) for the wishlists table
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Policies for wishlists table
-- Allow users to see their own wishlist items
CREATE POLICY "Allow individual read access" ON wishlists
FOR SELECT USING (
  (anon_id = current_setting('request.headers', true)::jsonb ->> 'x-anon-id') OR
  (contact_id = (current_setting('request.headers', true)::jsonb ->> 'x-contact-id')::uuid)
);

-- Allow users to create their own wishlist items
CREATE POLICY "Allow individual insert access" ON wishlists
FOR INSERT WITH CHECK (
  (anon_id = current_setting('request.headers', true)::jsonb ->> 'x-anon-id') OR
  (contact_id = (current_setting('request.headers', true)::jsonb ->> 'x-contact-id')::uuid)
);

-- Allow users to update their own wishlist items (e.g., contact_id after identification)
CREATE POLICY "Allow individual update access" ON wishlists
FOR UPDATE USING (
  (anon_id = current_setting('request.headers', true)::jsonb ->> 'x-anon-id') OR
  (contact_id = (current_setting('request.headers', true)::jsonb ->> 'x-contact-id')::uuid)
);

-- Allow users to delete their own wishlist items
CREATE POLICY "Allow individual delete access" ON wishlists
FOR DELETE USING (
  (anon_id = current_setting('request.headers', true)::jsonb ->> 'x-anon-id') OR
  (contact_id = (current_setting('request.headers', true)::jsonb ->> 'x-contact-id')::uuid)
);
