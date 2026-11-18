-- Factures : mise en pause des relances et notes internes.
-- À coller dans Supabase > SQL Editor > New query, puis « Run ».

alter table public.invoices add column if not exists paused boolean not null default false;
alter table public.invoices add column if not exists notes text not null default '';
