-- Page de paiement : à coller dans Supabase > SQL Editor > New query, puis « Run ».
-- Chaque facture reçoit un lien secret (impossible à deviner) vers une page de paiement publique.

alter table public.invoices
  add column if not exists pay_token uuid not null default gen_random_uuid();
create unique index if not exists invoices_pay_token_idx on public.invoices(pay_token);

-- Fonction publique qui ne renvoie QUE les infos nécessaires au paiement, pour un lien donné.
-- Elle ne permet pas de lister les factures ni de voir celles des autres.
create or replace function public.invoice_for_payment(p_token uuid)
returns table (
  number text,
  client_name text,
  amount_cents integer,
  due_date date,
  status text,
  company_name text,
  iban text
)
language sql
stable
security definer
set search_path = public
as $$
  select i.number, i.client_name, i.amount_cents, i.due_date, i.status,
         coalesce(p.company_name, ''), coalesce(p.iban, '')
    from public.invoices i
    left join public.profiles p on p.user_id = i.user_id
   where i.pay_token = p_token;
$$;

revoke all on function public.invoice_for_payment(uuid) from public;
grant execute on function public.invoice_for_payment(uuid) to anon, authenticated;
