-- 1. Ensure device_id column exists (in case it was dropped)
alter table public.transactions add column if not exists device_id text;

-- 2. Add Policies for Migration (Allow claiming orphaned transactions)
-- This is necessary because the strict "auth.uid() = user_id" policy hides rows where user_id is NULL.

create policy "Allow claiming orphaned transactions" on transactions
  for update
  using (user_id IS NULL)
  with check (auth.uid() = user_id); 

create policy "Allow viewing orphaned transactions" on transactions
  for select
  using (user_id IS NULL);

-- 3. Refresh Schema Cache (Instructional comment, user must do this in dashboard or it happens automatically over time)
notify pgrst, 'reload schema';
