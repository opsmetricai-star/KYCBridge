-- Run once if the Data API returns "permission denied for table ..." (newer Supabase projects
-- do not auto-grant privileges on tables created in SQL). RLS still restricts every row.
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;
grant insert on public.leads to anon;
grant usage, select on all sequences in schema public to authenticated, service_role;
grant execute on all functions in schema public to authenticated, service_role;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated, service_role;
alter default privileges in schema public grant usage, select on sequences to authenticated, service_role;
