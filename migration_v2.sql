-- 1. Create profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Add user_id column to transactions (nullable first to avoid errors with existing data)
alter table transactions add column if not exists user_id uuid references auth.users;

-- 3. Make device_id nullable (if it was not null)
alter table transactions alter column device_id drop not null;

-- 4. Enable RLS
alter table profiles enable row level security;
alter table transactions enable row level security;

-- 5. Drop existing policies to avoid conflicts (optional but safer)
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;

drop policy if exists "Users can view their own transactions" on transactions;
drop policy if exists "Users can insert their own transactions" on transactions;
drop policy if exists "Users can update their own transactions" on transactions;
drop policy if exists "Users can delete their own transactions" on transactions;
drop policy if exists "Allow claiming orphaned transactions" on transactions;
drop policy if exists "Allow viewing orphaned transactions" on transactions;
drop policy if exists "Public Access" on transactions; -- Drop the insecure policy from v1

-- 6. Re-create Policies

-- PROFILES
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- TRANSACTIONS
-- View, Insert, Update, Delete Own Transactions
create policy "Users can view their own transactions" on transactions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own transactions" on transactions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own transactions" on transactions
  for update using (auth.uid() = user_id);

create policy "Users can delete their own transactions" on transactions
  for delete using (auth.uid() = user_id);

-- Migration Policies (Device ID -> User ID)
create policy "Allow claiming orphaned transactions" on transactions
  for update
  using (user_id IS NULL)
  with check (auth.uid() = user_id); 

create policy "Allow viewing orphaned transactions" on transactions
  for select
  using (user_id IS NULL);
