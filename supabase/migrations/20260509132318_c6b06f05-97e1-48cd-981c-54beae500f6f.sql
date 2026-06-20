-- Roles enum and user_roles table (avoid recursive RLS by using SECURITY DEFINER fn)
create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists(select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Profiles policies
create policy "Profiles viewable by owner"
  on public.profiles for select to authenticated
  using (auth.uid() = id);
create policy "Profiles updatable by owner"
  on public.profiles for update to authenticated
  using (auth.uid() = id);

-- user_roles policies
create policy "Users can view own roles"
  on public.user_roles for select to authenticated
  using (auth.uid() = user_id);
create policy "Admins manage roles"
  on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Portfolio projects
create table public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text,
  slug text not null unique,
  category text not null,
  description text,
  price numeric,
  tags text[] not null default '{}',
  featured_image text,
  gallery text[] not null default '{}',
  published boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index portfolio_projects_category_idx on public.portfolio_projects(category);
create index portfolio_projects_created_at_idx on public.portfolio_projects(created_at desc);

alter table public.portfolio_projects enable row level security;

create policy "Anyone can view published projects"
  on public.portfolio_projects for select
  using (published = true);

create policy "Authenticated users can view all projects"
  on public.portfolio_projects for select to authenticated
  using (true);

create policy "Authenticated users can insert projects"
  on public.portfolio_projects for insert to authenticated
  with check (true);

create policy "Authenticated users can update projects"
  on public.portfolio_projects for update to authenticated
  using (true);

create policy "Authenticated users can delete projects"
  on public.portfolio_projects for delete to authenticated
  using (true);

-- Auto-update updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger portfolio_projects_touch
  before update on public.portfolio_projects
  for each row execute function public.touch_updated_at();