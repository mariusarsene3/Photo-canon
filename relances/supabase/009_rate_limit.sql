-- Limite de tentatives (connexion, inscription, mot de passe oublié) : compteur partagé par tous les serveurs.
-- À coller dans Supabase > SQL Editor > New query, puis « Run ».

-- Tentatives récentes, par clé (ex. « login:203.0.113.7 »).
create table if not exists public.rate_attempts (
  key text not null,
  attempted_at timestamptz not null default now()
);
create index if not exists rate_attempts_key_idx on public.rate_attempts(key, attempted_at);
create index if not exists rate_attempts_time_idx on public.rate_attempts(attempted_at);

-- Blocages temporaires en cours.
create table if not exists public.rate_blocks (
  key text primary key,
  blocked_until timestamptz not null
);

-- Réservées au serveur : aucun accès pour les visiteurs ni les utilisateurs connectés.
alter table public.rate_attempts enable row level security;
alter table public.rate_blocks enable row level security;
revoke all on public.rate_attempts, public.rate_blocks from anon, authenticated;
grant select, insert, update, delete on public.rate_attempts, public.rate_blocks to service_role;

-- Enregistre une tentative. Renvoie null si elle est autorisée, sinon la fin du blocage.
-- Au-delà de p_max tentatives sur p_window secondes : blocage pendant p_block secondes.
create or replace function public.hit_rate_limit(p_key text, p_max int, p_window int, p_block int)
returns timestamptz
language plpgsql security definer set search_path = public as $$
declare
  v_until timestamptz;
  v_count int;
begin
  select blocked_until into v_until from public.rate_blocks where key = p_key;
  if v_until is not null and v_until > now() then
    return v_until;
  end if;

  insert into public.rate_attempts(key) values (p_key);
  select count(*) into v_count from public.rate_attempts
   where key = p_key and attempted_at > now() - make_interval(secs => p_window);

  if v_count > p_max then
    v_until := now() + make_interval(secs => p_block);
    insert into public.rate_blocks(key, blocked_until) values (p_key, v_until)
      on conflict (key) do update set blocked_until = excluded.blocked_until;
    return v_until;
  end if;

  -- Ménage : on ne garde pas les vieilles tentatives (données personnelles : adresses IP).
  delete from public.rate_attempts where attempted_at < now() - interval '1 day';
  delete from public.rate_blocks where blocked_until < now() - interval '1 day';
  return null;
end;
$$;

-- Efface le compteur après une connexion réussie.
create or replace function public.clear_rate_limit(p_key text)
returns void
language sql security definer set search_path = public as $$
  delete from public.rate_attempts where key = p_key;
$$;

-- Seul le serveur (clé secrète) peut les appeler : sinon, n'importe qui pourrait bloquer l'adresse d'un autre.
revoke all on function public.hit_rate_limit(text, int, int, int) from public, anon, authenticated;
revoke all on function public.clear_rate_limit(text) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, int, int, int) to service_role;
grant execute on function public.clear_rate_limit(text) to service_role;
