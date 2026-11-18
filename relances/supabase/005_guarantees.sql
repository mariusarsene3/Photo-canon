-- Retenues de garantie (BTP) : à coller dans Supabase > SQL Editor > New query, puis « Run ».

create table if not exists public.guarantees (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  site text not null,                       -- chantier
  client_name text not null,
  client_email text not null default '',
  kind text not null default 'retenue' check (kind in ('retenue', 'caution')), -- somme retenue ou caution bancaire
  contract_amount_cents integer,            -- montant des travaux (facultatif)
  amount_cents integer not null check (amount_cents > 0), -- montant de la retenue
  reception_date date not null,             -- date de réception des travaux
  status text not null default 'waiting' check (status in ('waiting', 'claimed', 'released')),
  claimed_at timestamptz,
  released_at timestamptz,
  alert_30_sent_at timestamptz,             -- alerte à l'artisan 30 jours avant
  alert_0_sent_at timestamptz,              -- alerte à l'artisan le jour de la libération
  invoice_id bigint references public.invoices(id) on delete set null, -- si transformée en facture à relancer
  created_at timestamptz not null default now()
);
create index if not exists guarantees_user_idx on public.guarantees(user_id);

alter table public.guarantees enable row level security;
drop policy if exists "own guarantees" on public.guarantees;
create policy "own guarantees" on public.guarantees
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
grant select, insert, update, delete on public.guarantees to authenticated;
grant select, insert, update, delete on public.guarantees to service_role;
