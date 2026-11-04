-- Interim hotfix, applied while the previous site version is still live.
--
-- Before this, the public (anon) key could read every waitlist email and
-- read, change or delete every visitor and page-view row. The live site
-- still needs a few of those permissions until the new code ships:
--   * waitlist: insert(...).select() reads back the row it just saved;
--   * visitors: selects, updates and inserts its own row directly;
--   * page_views: insert only.
-- So this closes everything the live site doesn't use, and narrows the one
-- read it does use to rows saved in the last minute.
--
-- 20261105010000_lock_down_public_tables.sql replaces all of this once the
-- new site (which uses the track_visit() RPC and no reads) is deployed.

begin;

-- waitlist ----------------------------------------------------------------
drop policy if exists "Allow public read waitlist" on public.waitlist;
create policy "anon reads back only just-saved rows" on public.waitlist
  for select to anon, authenticated
  using (created_at > now() - interval '1 minute');
revoke update, delete, truncate, trigger, references on table public.waitlist from anon, authenticated;

-- page_views: add-only ----------------------------------------------------
drop policy if exists "Allow public all on page_views" on public.page_views;
create policy "anon can log page views" on public.page_views
  for insert to anon, authenticated
  with check (true);
revoke select, update, delete, truncate, trigger, references on table public.page_views from anon, authenticated;

-- visitors: still read/insert/update for the live tracker, never delete ---
drop policy if exists "Allow public all on visitors" on public.visitors;
create policy "anon tracker can read visitors" on public.visitors for select to anon, authenticated using (true);
create policy "anon tracker can add visitors" on public.visitors for insert to anon, authenticated with check (true);
create policy "anon tracker can update visitors" on public.visitors for update to anon, authenticated using (true) with check (true);
revoke delete, truncate, trigger, references on table public.visitors from anon, authenticated;

commit;
