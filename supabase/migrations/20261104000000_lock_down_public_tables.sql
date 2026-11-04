-- =============================================================================
-- Lock down anon access to waitlist, visitors and page_views
-- =============================================================================
--
-- Before: the browser bundle and /api/admin/data both used the anon key, and
-- the admin console fell back to reading all three tables directly with it.
-- That only works if RLS lets `anon` SELECT those tables, which exposes every
-- waitlist email and every visitor IP to anyone holding the (public) anon key.
--
-- After:
--   anon / authenticated may only
--     * INSERT into public.waitlist          (joinWaitlist, no RETURNING)
--     * INSERT into public.page_views        (trackPageView)
--     * EXECUTE public.track_visit(...)      (trackPageView visitor upsert)
--   and have NO select, update or delete on any of the three tables.
--   The admin console reads through /api/admin/data with the service-role key,
--   which bypasses RLS and is never shipped to the browser.
--
-- The live policies could not be inspected when this was written (the project
-- was paused). Run this first and keep the output so the change can be undone:
--
--   select tablename, policyname, cmd, roles, qual, with_check
--   from pg_policies
--   where schemaname = 'public' and tablename in ('waitlist', 'visitors', 'page_views')
--   order by tablename, policyname;
--
--   select table_name, grantee, privilege_type
--   from information_schema.role_table_grants
--   where table_schema = 'public'
--     and table_name in ('waitlist', 'visitors', 'page_views')
--     and grantee in ('anon', 'authenticated')
--   order by table_name, grantee, privilege_type;
--
--   -- track_visit assumes the visitors columns it writes are text/varchar
--   -- (timestamps timestamptz, total_visits integer). Confirm before applying:
--   select column_name, data_type
--   from information_schema.columns
--   where table_schema = 'public' and table_name = 'visitors'
--   order by ordinal_position;
--
-- This migration drops every existing policy on the three tables (each one is
-- reported with RAISE NOTICE) and replaces them with the policies below.
-- Ship order: apply this migration, then deploy the app code that calls
-- track_visit.
-- =============================================================================

begin;

-- 1. Enable RLS (idempotent) -------------------------------------------------
alter table public.waitlist   enable row level security;
alter table public.visitors   enable row level security;
alter table public.page_views enable row level security;

-- 2. Drop whatever policies exist today, logging each one ---------------------
do $$
declare
  pol record;
begin
  for pol in
    select tablename, policyname, cmd, roles::text as roles, qual, with_check
    from pg_policies
    where schemaname = 'public'
      and tablename in ('waitlist', 'visitors', 'page_views')
  loop
    raise notice 'dropping policy % on public.% (cmd=%, roles=%, using=%, check=%)',
      pol.policyname, pol.tablename, pol.cmd, pol.roles, pol.qual, pol.with_check;
    execute format('drop policy %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end
$$;

-- 3. Table privileges: least privilege, defence in depth on top of RLS --------
-- Supabase grants ALL on public tables to anon/authenticated by default; RLS is
-- then the only barrier. Revoke and grant back exactly what the site needs, so
-- a future permissive policy cannot silently re-open reads.
revoke all on table public.waitlist, public.visitors, public.page_views from anon, authenticated;

grant insert on table public.waitlist   to anon, authenticated;
grant insert on table public.page_views to anon, authenticated;
-- No grant on public.visitors: anon reaches it only through track_visit().

-- Serial (non-identity) id columns need USAGE on their sequence for INSERT.
do $$
declare
  seq text;
  t text;
begin
  foreach t in array array['waitlist', 'page_views'] loop
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = t and column_name = 'id'
    ) then
      seq := pg_get_serial_sequence(format('public.%I', t), 'id');
      if seq is not null then
        execute format('grant usage on sequence %s to anon, authenticated', seq);
      end if;
    end if;
  end loop;
end
$$;

-- 4. Policies ----------------------------------------------------------------
-- No SELECT/UPDATE/DELETE policies exist for anon or authenticated, so those
-- operations match zero rows even if a grant is added back later.

create policy "anon can join waitlist"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (
    email is not null
    and char_length(email) between 3 and 254
  );

create policy "anon can log page views"
  on public.page_views
  for insert
  to anon, authenticated
  with check (
    visitor_id is not null
    and char_length(visitor_id) <= 64
    and char_length(path) <= 2048
  );

-- 5. Visitor upsert RPC ------------------------------------------------------
-- trackPageView used to SELECT the visitor row and then UPDATE/INSERT it, which
-- required anon SELECT + UPDATE on every row of `visitors` (IPs, locations).
-- This function does the same upsert for a single caller-supplied visitor_id
-- without giving anon any read access. It returns nothing.
--
-- It is SECURITY DEFINER so it can write past RLS, and is therefore kept small:
-- empty search_path, fully qualified names, inputs bounded, no data returned.
-- visitor_id is a random client-generated id; as with any client-side analytics
-- the stats can be spoofed, but nothing can be read back.
create or replace function public.track_visit(
  p_visitor_id     text,
  p_is_new_session boolean,
  p_path           text,
  p_referrer       text default null,
  p_device_type    text default null,
  p_browser        text default null,
  p_os             text default null,
  p_screen_res     text default null,
  p_city           text default null,
  p_country        text default null,
  p_country_code   text default null,
  p_region         text default null,
  p_ip             text default null,
  p_flag_emoji     text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := now();
begin
  if p_visitor_id is null or p_visitor_id !~ '^v_[a-z0-9]{1,40}$' then
    raise exception 'invalid visitor id' using errcode = '22023';
  end if;

  p_path         := left(p_path, 2048);
  p_referrer     := left(p_referrer, 2048);
  p_device_type  := left(p_device_type, 32);
  p_browser      := left(p_browser, 32);
  p_os           := left(p_os, 32);
  p_screen_res   := left(p_screen_res, 32);
  p_city         := left(p_city, 100);
  p_country      := left(p_country, 100);
  p_country_code := left(p_country_code, 2);
  p_region       := left(p_region, 100);
  p_ip           := left(p_ip, 64);
  p_flag_emoji   := left(p_flag_emoji, 16);

  if p_is_new_session then
    update public.visitors v set
      total_visits = coalesce(v.total_visits, 1) + 1,
      last_seen_at = v_now,
      last_path    = p_path,
      referrer     = p_referrer,
      device_type  = p_device_type,
      browser      = p_browser,
      os           = p_os,
      screen_res   = p_screen_res,
      city         = coalesce(p_city, v.city),
      country      = coalesce(p_country, v.country),
      country_code = coalesce(p_country_code, v.country_code),
      region       = coalesce(p_region, v.region),
      ip           = coalesce(p_ip, v.ip),
      flag_emoji   = coalesce(p_flag_emoji, v.flag_emoji)
    where v.visitor_id = p_visitor_id;

    if not found then
      insert into public.visitors (
        visitor_id, total_visits, first_seen_at, last_seen_at,
        device_type, browser, os, screen_res, referrer, last_path,
        city, country, country_code, region, ip, flag_emoji
      ) values (
        p_visitor_id, 1, v_now, v_now,
        p_device_type, p_browser, p_os, p_screen_res, p_referrer, p_path,
        p_city, p_country, p_country_code, p_region, p_ip, p_flag_emoji
      );
    end if;
  else
    -- Same session: refresh activity and backfill location if we now have it.
    update public.visitors v set
      last_seen_at = v_now,
      last_path    = p_path,
      city         = coalesce(p_city, v.city),
      country      = coalesce(p_country, v.country),
      country_code = coalesce(p_country_code, v.country_code),
      region       = coalesce(p_region, v.region),
      ip           = coalesce(p_ip, v.ip),
      flag_emoji   = coalesce(p_flag_emoji, v.flag_emoji)
    where v.visitor_id = p_visitor_id;
  end if;
end;
$$;

revoke all on function public.track_visit(
  text, boolean, text, text, text, text, text, text, text, text, text, text, text, text
) from public;
grant execute on function public.track_visit(
  text, boolean, text, text, text, text, text, text, text, text, text, text, text, text
) to anon, authenticated;

commit;

-- =============================================================================
-- Verification (run as anon with the public key, e.g. from the browser console
-- or `curl -H "apikey: $ANON" -H "Authorization: Bearer $ANON" ...`):
--   GET  /rest/v1/waitlist?select=email     -> 401/403 permission denied
--   GET  /rest/v1/visitors?select=ip        -> 401/403 permission denied
--   GET  /rest/v1/page_views?select=*       -> 401/403 permission denied
--   POST /rest/v1/waitlist  {"email":"x@y.co"}            -> 201
--   POST /rest/v1/rpc/track_visit {"p_visitor_id":"v_abc123","p_is_new_session":true,"p_path":"/"} -> 204
-- And the Supabase security advisor should report no RLS warnings for these tables.
-- =============================================================================
