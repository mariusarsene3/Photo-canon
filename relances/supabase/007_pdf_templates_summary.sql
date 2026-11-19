-- Facture PDF jointe aux relances, rappel avant échéance, textes personnalisés, résumé du lundi.
-- À coller dans Supabase > SQL Editor > New query, puis « Run ».

-- 1. Facture PDF : chemin du fichier dans le stockage Supabase.
alter table public.invoices add column if not exists pdf_path text;

-- Espace de stockage privé « factures » (10 Mo max par fichier, PDF uniquement).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('factures', 'factures', false, 10485760, array['application/pdf'])
on conflict (id) do nothing;

-- Chaque utilisateur ne voit que les fichiers de son propre dossier (<son id>/...).
drop policy if exists "factures: lecture" on storage.objects;
create policy "factures: lecture" on storage.objects for select to authenticated
  using (bucket_id = 'factures' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "factures: ajout" on storage.objects;
create policy "factures: ajout" on storage.objects for insert to authenticated
  with check (bucket_id = 'factures' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "factures: remplacement" on storage.objects;
create policy "factures: remplacement" on storage.objects for update to authenticated
  using (bucket_id = 'factures' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "factures: suppression" on storage.objects;
create policy "factures: suppression" on storage.objects for delete to authenticated
  using (bucket_id = 'factures' and (storage.foldername(name))[1] = auth.uid()::text);

-- 2. Préférences de relance.
alter table public.profiles add column if not exists remind_before boolean not null default true; -- rappel 3 jours avant l'échéance
alter table public.profiles add column if not exists templates jsonb not null default '{}'::jsonb;  -- textes personnalisés
alter table public.profiles add column if not exists weekly_summary boolean not null default true; -- résumé du lundi
