-- Create the orders table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references contacts(id),
  total_amount numeric(10, 2) not null,
  status text default 'pending' not null,
  shipping_address text not null,
  created_at timestamptz default now()
);

-- Create the order_items table
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) not null,
  product_id int not null,
  variant_id int not null,
  quantity int default 1 not null,
  price_at_purchase numeric(10, 2) not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS) for orders and order_items tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for orders table
-- Allow authenticated users to view their own orders
CREATE POLICY "Allow authenticated users to view their own orders" ON orders
FOR SELECT USING (auth.uid() = contact_id);

-- Allow authenticated users to create their own orders
CREATE POLICY "Allow authenticated users to create their own orders" ON orders
FOR INSERT WITH CHECK (auth.uid() = contact_id);

-- Policies for order_items table
-- Allow authenticated users to view order items associated with their orders
CREATE POLICY "Allow authenticated users to view their own order items" ON order_items
FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.contact_id = auth.uid()));

-- Allow authenticated users to create order items associated with their orders
CREATE POLICY "Allow authenticated users to create their own order items" ON order_items
FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.contact_id = auth.uid()));
