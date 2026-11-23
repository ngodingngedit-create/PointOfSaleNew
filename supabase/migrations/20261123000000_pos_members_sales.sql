-- Private POS membership and sales ledger for the existing Supabase Free project.
-- Apply only after 20261103000000_pos_pin_security.sql has been applied.
-- Customer contact details and sales history remain server-only; never expose the service role key.

create table if not exists public.pos_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(btrim(full_name)) between 2 and 100),
  phone_e164 text not null unique check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pos_transactions (
  id uuid primary key default gen_random_uuid(),
  idempotency_key uuid not null unique,
  request_hash text not null check (request_hash ~ '^[0-9a-f]{64}$'),
  branch_id text,
  cashier_id text not null check (length(cashier_id) between 1 and 128),
  cashier_name text not null check (length(cashier_name) between 1 and 120),
  member_id uuid references public.pos_members(id) on delete set null,
  order_type text not null check (order_type in ('dine_in', 'take_away')),
  table_id text,
  table_label text,
  payment_method text not null check (payment_method in ('cash', 'qris')),
  subtotal bigint not null check (subtotal >= 0),
  tax_amount bigint not null default 0 check (tax_amount >= 0),
  discount_amount bigint not null default 0 check (discount_amount >= 0),
  total_amount bigint not null check (total_amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  check ((order_type = 'dine_in' and table_id is not null and table_label is not null)
      or (order_type = 'take_away' and table_id is null and table_label is null)),
  check (total_amount = subtotal + tax_amount - discount_amount)
);

create index if not exists pos_transactions_branch_created_idx
  on public.pos_transactions(branch_id, created_at desc)
  where status = 'completed';
create index if not exists pos_transactions_created_idx
  on public.pos_transactions(created_at desc)
  where status = 'completed';
create index if not exists pos_transactions_branch_completed_idx
  on public.pos_transactions(branch_id, completed_at desc)
  where status = 'completed';
create index if not exists pos_transactions_member_idx
  on public.pos_transactions(member_id, created_at desc)
  where member_id is not null;

create table if not exists public.pos_transaction_items (
  id bigint generated always as identity primary key,
  transaction_id uuid not null references public.pos_transactions(id) on delete cascade,
  product_id text not null check (length(product_id) between 1 and 128),
  variant_key text,
  product_name text not null check (length(product_name) between 1 and 200),
  category text,
  sku text,
  variant_name text,
  price_at_sale bigint not null check (price_at_sale >= 0),
  qty integer not null check (qty > 0),
  subtotal bigint not null check (subtotal = price_at_sale * qty)
);

create index if not exists pos_transaction_items_transaction_idx
  on public.pos_transaction_items(transaction_id);
create index if not exists pos_transaction_items_product_idx
  on public.pos_transaction_items(product_id);

alter table public.pos_members enable row level security;
alter table public.pos_members force row level security;
alter table public.pos_transactions enable row level security;
alter table public.pos_transactions force row level security;
alter table public.pos_transaction_items enable row level security;
alter table public.pos_transaction_items force row level security;

revoke all on table public.pos_members from public, anon, authenticated;
revoke all on table public.pos_transactions from public, anon, authenticated;
revoke all on table public.pos_transaction_items from public, anon, authenticated;
grant all on table public.pos_members to service_role;
grant all on table public.pos_transactions to service_role;
grant all on table public.pos_transaction_items to service_role;
grant usage, select on sequence public.pos_transaction_items_id_seq to service_role;

create or replace function public.pos_begin_checkout(
  p_idempotency_key uuid,
  p_request_hash text,
  p_branch_id text,
  p_cashier_id text,
  p_cashier_name text,
  p_member_id uuid,
  p_order_type text,
  p_table_id text,
  p_table_label text,
  p_payment_method text,
  p_subtotal bigint,
  p_items jsonb
)
returns table(transaction_id uuid, transaction_status text, created_new boolean)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_id uuid;
  v_status text;
  v_hash text;
  v_item jsonb;
  v_new boolean := false;
  v_items_total bigint := 0;
begin
  if p_idempotency_key is null
     or p_request_hash is null or p_request_hash !~ '^[0-9a-f]{64}$'
     or p_cashier_id is null or length(p_cashier_id) not between 1 and 128
     or p_cashier_name is null or length(p_cashier_name) not between 1 and 120
     or p_order_type is null or p_order_type not in ('dine_in', 'take_away')
     or p_payment_method is null or p_payment_method not in ('cash', 'qris')
     or p_subtotal is null or p_subtotal < 0
     or p_items is null or jsonb_typeof(p_items) is distinct from 'array' then
    raise exception 'invalid checkout payload';
  end if;
  if jsonb_array_length(p_items) = 0 then raise exception 'invalid checkout payload'; end if;

  if (p_order_type = 'dine_in' and (p_table_id is null or p_table_label is null))
     or (p_order_type = 'take_away' and (p_table_id is not null or p_table_label is not null)) then
    raise exception 'invalid table selection';
  end if;

  insert into public.pos_transactions (
    idempotency_key, request_hash, branch_id, cashier_id, cashier_name,
    member_id, order_type, table_id, table_label, payment_method,
    subtotal, tax_amount, discount_amount, total_amount, status
  ) values (
    p_idempotency_key, p_request_hash, p_branch_id, p_cashier_id, p_cashier_name,
    p_member_id, p_order_type, p_table_id, p_table_label, p_payment_method,
    p_subtotal, 0, 0, p_subtotal, 'pending'
  )
  on conflict (idempotency_key) do nothing
  returning id, status, request_hash into v_id, v_status, v_hash;

  if v_id is null then
    select t.id, t.status, t.request_hash
      into v_id, v_status, v_hash
      from public.pos_transactions t
     where t.idempotency_key = p_idempotency_key
     for update;
    if v_id is null then raise exception 'checkout could not be started'; end if;
    if v_hash <> p_request_hash then raise exception 'idempotency key reused with different payload'; end if;
  else
    v_new := true;
    for v_item in select value from jsonb_array_elements(p_items)
    loop
      if coalesce(v_item->>'productId', '') = ''
         or coalesce(v_item->>'productName', '') = ''
         or coalesce((v_item->>'qty')::integer, 0) <= 0
         or coalesce((v_item->>'priceAtSale')::bigint, -1) < 0
         or coalesce((v_item->>'subtotal')::bigint, -1)
            <> (v_item->>'qty')::integer * (v_item->>'priceAtSale')::bigint then
        raise exception 'invalid checkout item';
      end if;
      insert into public.pos_transaction_items (
        transaction_id, product_id, variant_key, product_name, category,
        sku, variant_name, price_at_sale, qty, subtotal
      ) values (
        v_id, left(v_item->>'productId', 128), nullif(v_item->>'variantKey', ''),
        left(v_item->>'productName', 200), nullif(left(v_item->>'category', 120), ''),
        nullif(left(v_item->>'sku', 80), ''), nullif(left(v_item->>'variantName', 120), ''),
        (v_item->>'priceAtSale')::bigint, (v_item->>'qty')::integer,
        (v_item->>'subtotal')::bigint
      );
      v_items_total := v_items_total + (v_item->>'subtotal')::bigint;
    end loop;
    if v_items_total <> p_subtotal then raise exception 'checkout total does not match items'; end if;
  end if;

  return query select v_id, v_status, v_new;
end;
$$;

create or replace function public.pos_fail_checkout(p_transaction_id uuid)
returns table(transaction_id uuid, transaction_status text)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_id uuid;
  v_status text;
begin
  update public.pos_transactions t
     set status = 'failed'
   where t.id = p_transaction_id and t.status = 'pending'
   returning t.id, t.status into v_id, v_status;
  if v_id is null then raise exception 'checkout transaction cannot be marked failed'; end if;
  return query select v_id, v_status;
end;
$$;

create or replace function public.pos_complete_checkout(p_transaction_id uuid)
returns table(transaction_id uuid, transaction_status text, completed_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_id uuid;
  v_status text;
  v_completed timestamptz;
begin
  update public.pos_transactions t
     set status = 'completed', completed_at = coalesce(t.completed_at, now())
   where t.id = p_transaction_id and t.status in ('pending', 'completed')
   returning t.id, t.status, t.completed_at into v_id, v_status, v_completed;
  if v_id is null then raise exception 'checkout transaction not found'; end if;
  return query select v_id, v_status, v_completed;
end;
$$;

revoke all on function public.pos_begin_checkout(uuid, text, text, text, text, uuid, text, text, text, text, bigint, jsonb) from public, anon, authenticated;
revoke all on function public.pos_fail_checkout(uuid) from public, anon, authenticated;
revoke all on function public.pos_complete_checkout(uuid) from public, anon, authenticated;
grant execute on function public.pos_begin_checkout(uuid, text, text, text, text, uuid, text, text, text, text, bigint, jsonb) to service_role;
grant execute on function public.pos_fail_checkout(uuid) to service_role;
grant execute on function public.pos_complete_checkout(uuid) to service_role;
