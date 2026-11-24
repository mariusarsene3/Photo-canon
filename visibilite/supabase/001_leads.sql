-- Repérez : demandes d'audit laissées par les commerçants après le test.
-- À exécuter une fois dans Supabase > SQL Editor.
create table if not exists public.reperez_leads (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  business text not null check (char_length(business) between 2 and 80),
  trade text not null check (char_length(trade) between 2 and 60),
  city text not null check (char_length(city) between 2 and 60),
  contact_name text not null check (char_length(contact_name) between 2 and 80),
  phone text check (phone is null or char_length(phone) between 6 and 25),
  email text check (email is null or char_length(email) between 5 and 120),
  message text check (message is null or char_length(message) <= 1000),
  cited boolean,
  constraint phone_or_email check (phone is not null or email is not null)
);

alter table public.reperez_leads enable row level security;

-- Le site (clé publique « anon ») peut seulement AJOUTER une demande : il ne peut ni les lire, ni les modifier.
-- Les demandes se consultent dans Supabase > Table Editor.
drop policy if exists "le site peut ajouter une demande" on public.reperez_leads;
create policy "le site peut ajouter une demande" on public.reperez_leads
  for insert to anon with check (true);

revoke all on public.reperez_leads from anon, authenticated;
grant insert on public.reperez_leads to anon;
