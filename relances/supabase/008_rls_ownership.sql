-- Sécurité : une relance ou une retenue ne peut être rattachée qu'à une facture du même compte.
-- À coller dans Supabase > SQL Editor > New query, puis « Run ».

-- 1. Nettoyage : supprime d'éventuelles lignes rattachées à la facture d'un autre compte.
delete from public.reminders r
 using public.invoices i
 where i.id = r.invoice_id and i.user_id <> r.user_id;

update public.guarantees g
   set invoice_id = null
  from public.invoices i
 where i.id = g.invoice_id and i.user_id <> g.user_id;

-- 2. Relances : uniquement sur ses propres factures.
drop policy if exists "own reminders" on public.reminders;
create policy "own reminders" on public.reminders
  for all to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.invoices i where i.id = invoice_id and i.user_id = auth.uid())
  );

-- 3. Retenues de garantie : rattachement à une facture uniquement si elle est à soi.
drop policy if exists "own guarantees" on public.guarantees;
create policy "own guarantees" on public.guarantees
  for all to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and (invoice_id is null or exists (select 1 from public.invoices i where i.id = invoice_id and i.user_id = auth.uid()))
  );
