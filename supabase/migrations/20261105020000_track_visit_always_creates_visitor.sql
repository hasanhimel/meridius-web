-- track_visit: create the visitor row whenever it is missing, not only on the
-- first page of a session.
--
-- A browser session that started before 20261105010000 (or whose first call
-- failed) is marked as tracked but has no row in public.visitors; every later
-- call took the "same session" branch, updated nothing, and the page_views
-- insert that follows failed its foreign key (HTTP 409). The function now
-- always upserts. Signature, grants and input limits are unchanged.

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
  else
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

  if not found then
    insert into public.visitors (
      visitor_id, total_visits, first_seen_at, last_seen_at,
      device_type, browser, os, screen_res, referrer, last_path,
      city, country, country_code, region, ip, flag_emoji
    ) values (
      p_visitor_id, 1, v_now, v_now,
      p_device_type, p_browser, p_os, p_screen_res, p_referrer, p_path,
      p_city, p_country, p_country_code, p_region, p_ip, p_flag_emoji
    )
    on conflict (visitor_id) do nothing;
  end if;
end;
$$;
