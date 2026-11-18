-- À coller dans Supabase > SQL Editor > New query, puis « Run ».
-- Crée les tables et les règles de sécurité : chaque utilisateur ne voit que ses données.

create table if not exists public.invoices (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  number text not null,
  client_name text not null,
  client_email text not null,
  amount_cents integer not null check (amount_cents > 0),
  due_date date not null,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists invoices_user_idx on public.invoices(user_id);

create table if not exists public.reminders (
  id bigint generated always as identity primary key,
  invoice_id bigint not null references public.invoices(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  step smallint not null,
  sent_at timestamptz not null default now(),
  unique (invoice_id, step)
);

create table if not exists public.profiles (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  company_name text not null default '',
  iban text not null default ''
);

alter table public.invoices  enable row level security;
alter table public.reminders enable row level security;
alter table public.profiles  enable row level security;

drop policy if exists "own invoices" on public.invoices;
create policy "own invoices" on public.invoices
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "own reminders" on public.reminders;
create policy "own reminders" on public.reminders
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Droits d'accès pour les utilisateurs connectés (les règles RLS ci-dessus filtrent ensuite par compte).
-- Nécessaire sur les projets Supabase récents, qui n'exposent plus les tables automatiquement.
grant select, insert, update, delete on public.invoices, public.reminders, public.profiles to authenticated;
grant select, insert, update, delete on public.invoices, public.reminders, public.profiles to service_role;
