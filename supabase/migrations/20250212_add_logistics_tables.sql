-- Create logistics_companies table
create table if not exists public.logistics_companies (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  district text not null,
  rating decimal(3,2) default 0.00,
  available_vehicles integer default 0,
  contact_number text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for logistics_companies
alter table public.logistics_companies enable row level security;

-- Create logistics_orders table
create table if not exists public.logistics_orders (
  id uuid default uuid_generate_v4() primary key,
  storage_request_id uuid references public.storage_requests on delete cascade not null,
  logistics_company_id uuid references public.logistics_companies on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'in_transit', 'delivered')) default 'pending',
  pickup_date timestamp with time zone,
  delivery_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for logistics_orders
alter table public.logistics_orders enable row level security;

-- Add logistics_status column to storage_requests
alter table public.storage_requests
add column if not exists logistics_status text check (logistics_status in ('pending', 'requested', 'in_transit', 'delivered')) default 'pending';

-- Create policies for logistics_companies
create policy "Logistics companies can view their own data"
  on public.logistics_companies
  for select
  using (auth.uid() = id);

create policy "Logistics companies can update their own data"
  on public.logistics_companies
  for update
  using (auth.uid() = id);

-- Create policies for logistics_orders
create policy "Logistics companies can view their orders"
  on public.logistics_orders
  for select
  using (auth.uid() = logistics_company_id);

create policy "Logistics companies can update their orders"
  on public.logistics_orders
  for update
  using (auth.uid() = logistics_company_id);

create policy "Farmers can view their logistics orders"
  on public.logistics_orders
  for select
  using (
    exists (
      select 1 from public.storage_requests sr
      where sr.id = storage_request_id
      and sr.farmer_id = auth.uid()
    )
  );