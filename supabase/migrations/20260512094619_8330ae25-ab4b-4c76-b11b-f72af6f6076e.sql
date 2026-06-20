
create type public.order_status as enum ('pending','contacted','paid','completed','cancelled');
create type public.order_source as enum ('whatsapp','manual','paid');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_name text not null,
  buyer_phone text,
  buyer_email text,
  notes text,
  status public.order_status not null default 'pending',
  source public.order_source not null default 'whatsapp',
  total_amount numeric default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  project_id uuid references public.portfolio_projects(id) on delete set null,
  title text not null,
  price numeric default 0,
  quantity int not null default 1,
  created_at timestamptz not null default now()
);

create index on public.order_items(order_id);
create index on public.orders(created_at desc);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public can insert orders (place an order without account)
create policy "Anyone can place an order"
  on public.orders for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can add order items"
  on public.order_items for insert
  to anon, authenticated
  with check (true);

-- Admin-only read/update/delete
create policy "Admins can view orders"
  on public.orders for select
  to authenticated
  using (public.has_role(auth.uid(),'admin'));

create policy "Admins can update orders"
  on public.orders for update
  to authenticated
  using (public.has_role(auth.uid(),'admin'));

create policy "Admins can delete orders"
  on public.orders for delete
  to authenticated
  using (public.has_role(auth.uid(),'admin'));

create policy "Admins can view order items"
  on public.order_items for select
  to authenticated
  using (public.has_role(auth.uid(),'admin'));

create policy "Admins can update order items"
  on public.order_items for update
  to authenticated
  using (public.has_role(auth.uid(),'admin'));

create policy "Admins can delete order items"
  on public.order_items for delete
  to authenticated
  using (public.has_role(auth.uid(),'admin'));

create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();
