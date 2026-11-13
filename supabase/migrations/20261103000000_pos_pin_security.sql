-- Secure POS authentication storage for the existing Supabase Free project.
-- Apply this migration only to project qrqwdrhogdiqdbzbhbcl.

create table if not exists public.pos_cashier_pin_credentials (
  cashier_id text primary key check (length(cashier_id) between 1 and 128),
  pin_salt text not null check (length(pin_salt) between 16 and 64),
  pin_hash text not null check (length(pin_hash) between 64 and 128),
  updated_at timestamptz not null default now()
);

alter table public.pos_cashier_pin_credentials enable row level security;
alter table public.pos_cashier_pin_credentials force row level security;
revoke all on table public.pos_cashier_pin_credentials from public, anon, authenticated;
grant all on table public.pos_cashier_pin_credentials to service_role;

create table if not exists public.pos_auth_rate_limits (
  bucket_key text primary key check (length(bucket_key) = 64),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  window_started_at timestamptz not null default now(),
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists pos_auth_rate_limits_updated_at_idx
  on public.pos_auth_rate_limits(updated_at);
alter table public.pos_auth_rate_limits enable row level security;
alter table public.pos_auth_rate_limits force row level security;
revoke all on table public.pos_auth_rate_limits from public, anon, authenticated;
grant all on table public.pos_auth_rate_limits to service_role;

create or replace function public.pos_rate_limit_check(
  p_bucket_key text,
  p_max_attempts integer,
  p_window_seconds integer,
  p_lock_seconds integer
)
returns table(allowed boolean, locked_until timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  current_row public.pos_auth_rate_limits%rowtype;
  next_attempt integer;
  v_now timestamptz := clock_timestamp();
begin
  if p_bucket_key is null or length(p_bucket_key) <> 64
     or p_max_attempts < 2 or p_max_attempts > 100
     or p_window_seconds < 60 or p_window_seconds > 86400
     or p_lock_seconds < 60 or p_lock_seconds > 86400 then
    raise exception 'invalid rate limit parameters';
  end if;

  -- Bound table growth without a separate scheduler.
  delete from public.pos_auth_rate_limits
   where updated_at < v_now - interval '30 days';

  insert into public.pos_auth_rate_limits(bucket_key, attempt_count, window_started_at, updated_at)
  values (p_bucket_key, 0, v_now, v_now)
  on conflict (bucket_key) do nothing;

  select * into current_row
  from public.pos_auth_rate_limits
  where bucket_key = p_bucket_key
  for update;

  if current_row.locked_until is not null and current_row.locked_until > v_now then
    return query select false, current_row.locked_until;
    return;
  end if;

  if current_row.window_started_at <= v_now - make_interval(secs => p_window_seconds)
     or (current_row.locked_until is not null and current_row.locked_until <= v_now) then
    current_row.attempt_count := 0;
    current_row.window_started_at := v_now;
    current_row.locked_until := null;
  end if;

  next_attempt := current_row.attempt_count + 1;
  if next_attempt >= p_max_attempts then
    current_row.attempt_count := next_attempt;
    current_row.locked_until := v_now + make_interval(secs => p_lock_seconds);
    current_row.updated_at := v_now;
    update public.pos_auth_rate_limits
       set attempt_count = current_row.attempt_count,
           window_started_at = current_row.window_started_at,
           locked_until = current_row.locked_until,
           updated_at = current_row.updated_at
     where bucket_key = p_bucket_key;
    return query select false, current_row.locked_until;
    return;
  end if;

  update public.pos_auth_rate_limits
     set attempt_count = next_attempt,
         window_started_at = current_row.window_started_at,
         locked_until = null,
         updated_at = v_now
   where bucket_key = p_bucket_key;
  return query select true, null::timestamptz;
end;
$$;

create or replace function public.pos_rate_limit_clear(p_bucket_key text)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if p_bucket_key is null or length(p_bucket_key) <> 64 then
    raise exception 'invalid rate limit key';
  end if;
  delete from public.pos_auth_rate_limits where bucket_key = p_bucket_key;
end;
$$;

revoke all on function public.pos_rate_limit_check(text, integer, integer, integer) from public, anon, authenticated;
revoke all on function public.pos_rate_limit_clear(text) from public, anon, authenticated;
grant execute on function public.pos_rate_limit_check(text, integer, integer, integer) to service_role;
grant execute on function public.pos_rate_limit_clear(text) to service_role;
