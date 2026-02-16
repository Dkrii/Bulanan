-- Create a table for public profiles (linked to auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for transactions
create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null, -- Linked to Supabase Auth
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date timestamp with time zone not null,
  type text check (type in ('income', 'expense')) not null,
  category text not null,
  amount numeric not null, -- User requested integer, but numeric covers it safely
  note text,
  device_id text -- Keeping for legacy support/migration, nullable
);

-- Enable RLS on transactions
alter table transactions enable row level security;

-- Create policies for transactions
-- Only allow users to see their own transactions
create policy "Users can view their own transactions" on transactions
  for select using (auth.uid() = user_id);

-- Only allow users to insert their own transactions
create policy "Users can insert their own transactions" on transactions
  for insert with check (auth.uid() = user_id);

-- Only allow users to update their own transactions
create policy "Users can update their own transactions" on transactions
  for update using (auth.uid() = user_id);

-- Only allow users to delete their own transactions
create policy "Users can delete their own transactions" on transactions
  for delete using (auth.uid() = user_id);

-- Allow claiming orphaned transactions
create policy "Allow claiming orphaned transactions" on transactions
  for update
  using (user_id IS NULL)
  with check (auth.uid() = user_id); 

-- Also need select permission for orphans to find them
create policy "Allow viewing orphaned transactions" on transactions
  for select
  using (user_id IS NULL);
