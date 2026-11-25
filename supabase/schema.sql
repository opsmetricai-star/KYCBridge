-- KYCBridge schema. Run in the Supabase SQL editor (or `supabase db push`).
create extension if not exists "pgcrypto";

-- Organizations & membership -------------------------------------------------
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text not null default 'free' check (plan in ('free','starter','growth','scale')),
  plan_renews_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  org_id uuid references public.organizations(id) on delete set null,
  role text not null default 'owner' check (role in ('owner','admin','analyst')),
  created_at timestamptz not null default now()
);

-- helper: current user's org (security definer avoids RLS recursion)
create or replace function public.current_org() returns uuid
language sql stable security definer set search_path = public as
$$ select org_id from public.profiles where id = auth.uid() $$;

-- Verifications ---------------------------------------------------------------
create table if not exists public.verifications (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  entity_type text not null default 'individual',
  channel text not null default 'web',
  full_name text not null,
  email text not null,
  date_of_birth date,
  country text not null,
  address text,
  phone text,
  id_type text not null,
  id_number text,
  document_path text,
  risk_score int not null,
  decision text not null check (decision in ('approve','review','deny')),
  signals jsonb not null default '[]',
  watchlist_hits int not null default 0,
  ai_review jsonb,
  created_at timestamptz not null default now()
);
create index if not exists verifications_org_idx on public.verifications(org_id, created_at desc);

-- Cases -----------------------------------------------------------------------
create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  verification_id uuid references public.verifications(id) on delete set null,
  title text not null,
  status text not null default 'open' check (status in ('open','in_review','escalated','closed')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  assignee uuid references auth.users(id) on delete set null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists cases_org_idx on public.cases(org_id, created_at desc);

-- Watchlist entries (org-managed list) and screening runs ---------------------
create table if not exists public.watchlist_entries (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  list_type text not null default 'internal' check (list_type in ('sanctions','pep','adverse_media','internal')),
  country text,
  notes text,
  created_at timestamptz not null default now()
);
create table if not exists public.screenings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  query_name text not null,
  matches jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- Workflows (decision thresholds per org) -------------------------------------
create table if not exists public.workflows (
  org_id uuid primary key references public.organizations(id) on delete cascade,
  approve_below int not null default 30 check (approve_below between 0 and 100),
  deny_at int not null default 70 check (deny_at between 0 and 100),
  auto_case boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Usage, notifications, payments ---------------------------------------------
create table if not exists public.usage_events (
  id bigint generated always as identity primary key,
  org_id uuid not null references public.organizations(id) on delete cascade,
  kind text not null check (kind in ('check','ai_review','screening')),
  created_at timestamptz not null default now()
);
create index if not exists usage_org_idx on public.usage_events(org_id, kind, created_at);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Payment claims: user submits the Selar order reference; an admin verifies it
-- in Selar and approves. A redirect alone never upgrades a plan.
create table if not exists public.payment_claims (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  plan text not null check (plan in ('starter','growth','scale')),
  order_ref text not null,
  payer_email text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (order_ref)
);

-- Auto-provision org + profile on signup -------------------------------------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare new_org uuid;
begin
  insert into public.organizations(name, created_by)
    values (coalesce(new.raw_user_meta_data->>'company', split_part(new.email,'@',1) || '''s org'), new.id)
    returning id into new_org;
  insert into public.profiles(id, email, full_name, org_id, role)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name', new_org, 'owner');
  insert into public.workflows(org_id) values (new_org);
  insert into public.notifications(org_id, title, body)
    values (new_org, 'Welcome to KYCBridge', 'Run your first identity check from the Verifications page.');
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security ------------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.verifications enable row level security;
alter table public.cases enable row level security;
alter table public.watchlist_entries enable row level security;
alter table public.screenings enable row level security;
alter table public.workflows enable row level security;
alter table public.usage_events enable row level security;
alter table public.notifications enable row level security;
alter table public.payment_claims enable row level security;

create policy org_read on public.organizations for select using (id = public.current_org());
create policy org_update_name on public.organizations for update using (id = public.current_org()) with check (id = public.current_org());
-- NOTE: plan column is protected by trigger below (only service role may change it)

create policy profile_self on public.profiles for select using (id = auth.uid() or org_id = public.current_org());
create policy profile_update_self on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and org_id = public.current_org());

create policy ver_all on public.verifications for all using (org_id = public.current_org()) with check (org_id = public.current_org());
create policy case_all on public.cases for all using (org_id = public.current_org()) with check (org_id = public.current_org());
create policy wl_all on public.watchlist_entries for all using (org_id = public.current_org()) with check (org_id = public.current_org());
create policy scr_all on public.screenings for all using (org_id = public.current_org()) with check (org_id = public.current_org());
create policy wf_all on public.workflows for all using (org_id = public.current_org()) with check (org_id = public.current_org());
create policy use_read on public.usage_events for select using (org_id = public.current_org());
create policy use_insert on public.usage_events for insert with check (org_id = public.current_org());
create policy note_all on public.notifications for all using (org_id = public.current_org()) with check (org_id = public.current_org());
create policy claim_read on public.payment_claims for select using (org_id = public.current_org());
create policy claim_insert on public.payment_claims for insert with check (org_id = public.current_org() and status = 'pending');

-- Prevent clients from changing their own plan.
create or replace function public.protect_plan() returns trigger
language plpgsql as $$
begin
  if (new.plan is distinct from old.plan or new.plan_renews_at is distinct from old.plan_renews_at)
     and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'plan can only be changed by the billing system';
  end if;
  return new;
end $$;
drop trigger if exists protect_plan_trg on public.organizations;
create trigger protect_plan_trg before update on public.organizations
  for each row execute function public.protect_plan();

-- Storage: private bucket for ID documents, scoped by org folder -----------------
insert into storage.buckets (id, name, public) values ('documents', 'documents', false)
  on conflict (id) do nothing;
create policy doc_read on storage.objects for select
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = public.current_org()::text);
create policy doc_write on storage.objects for insert
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = public.current_org()::text);

-- Marketing leads (demo requests, newsletter). Anyone may insert, nobody may read via the API.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('demo','subscribe')),
  email text not null,
  name text,
  company text,
  message text,
  created_at timestamptz not null default now()
);
alter table public.leads enable row level security;
create policy leads_insert on public.leads for insert to anon, authenticated with check (true);
