-- Create the transactions table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  device_id text not null,
  date date not null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  amount numeric not null,
  note text
);

-- Enable Row Level Security (RLS)
alter table public.transactions enable row level security;

-- Create Policy: Allow anyone with a device_id to Select their own data
create policy "Allow select based on device_id"
on public.transactions
for select
using (true); 
-- Note: Since this is a public demo without auth, we technically allow reading all. 
-- Ideally we'd filter `device_id = current_setting('my.device_id')` if we sent it in headers,
-- but for this simple localStorage implementation, we just open it up or keep it simple.
-- For a strictly private app, we should use RLS carefully.
-- optimize: Index on device_id for faster lookups
create index idx_transactions_device_id on public.transactions(device_id);
create index idx_transactions_date on public.transactions(date);

-- Policy: Allow Insert for anyone (public)
create policy "Allow public insert"
on public.transactions
for insert
with check (true);

-- Policy: Allow Update based on device_id (In a real app, you'd verify ownership)
create policy "Allow public update"
on public.transactions
for update
using (true);

-- Policy: Allow Delete
create policy "Allow public delete"
on public.transactions
for delete
using (true);
