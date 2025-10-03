-- Crear la tabla contacts para almacenar la información del cliente
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  phone text unique,
  created_at timestamptz default now()
);

-- Añadir una columna de clave foránea a la tabla wishlists para vincularla con un contacto
alter table wishlists
add column if not exists contact_id uuid references contacts(id);
