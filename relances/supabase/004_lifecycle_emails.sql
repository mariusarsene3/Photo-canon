-- E-mails automatiques (bienvenue, coup de pouce, fin d'essai) :
-- à coller dans Supabase > SQL Editor > New query, puis « Run ».

-- Journal des e-mails envoyés : un même e-mail n'est jamais envoyé deux fois à une personne.
-- Réservé au serveur : aucun accès pour les utilisateurs.
create table if not exists public.lifecycle_emails (
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null, -- welcome | nudge | trial_ending | trial_ended
  sent_at timestamptz not null default now(),
  primary key (user_id, kind)
);
alter table public.lifecycle_emails enable row level security;
grant select, insert, update, delete on public.lifecycle_emails to service_role;

-- Préférence de l'utilisateur : recevoir ou non les conseils (coup de pouce, rappels de fin d'essai).
alter table public.profiles add column if not exists product_emails boolean not null default true;
