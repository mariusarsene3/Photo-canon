-- Abonnement et suppression de compte : à coller dans Supabase > SQL Editor > New query, puis « Run ».

-- 1) Abonnement : une ligne par utilisateur. L'utilisateur peut LIRE la sienne mais jamais la modifier :
--    seul le serveur (clé de service, webhook Stripe) écrit dans cette table.
create table if not exists public.billing (
  user_id uuid primary key references auth.users(id) on delete cascade,
  trial_ends_at timestamptz not null default (now() + interval '14 days'),
  status text, -- statut Stripe : active, trialing, past_due, canceled, unpaid… (null = jamais abonné)
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.billing enable row level security;
drop policy if exists "read own billing" on public.billing;
create policy "read own billing" on public.billing for select to authenticated using (user_id = auth.uid());
grant select on public.billing to authenticated;
grant select, insert, update, delete on public.billing to service_role;

-- Comptes déjà créés : essai de 14 jours à partir de leur inscription.
insert into public.billing (user_id, trial_ends_at)
select id, created_at + interval '14 days' from auth.users
on conflict (user_id) do nothing;

-- Nouveaux comptes : ligne créée automatiquement à l'inscription.
create or replace function public.handle_new_user_billing()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.billing (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created_billing on auth.users;
create trigger on_auth_user_created_billing
  after insert on auth.users for each row execute function public.handle_new_user_billing();

-- 2) Suppression de compte par l'utilisateur lui-même (RGPD) : efface le compte et, en cascade,
--    ses factures, relances, paramètres et abonnement.
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
