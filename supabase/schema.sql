-- ============================================================================
-- DUITku — Supabase schema (Postgres)
-- Sumber: SRS.md §9.1 (User), §9.2 (Transaction), §4.2 (Data Isolation)
--
-- CARA PAKAI:
--   1. Buka Supabase Dashboard > SQL Editor > New query
--   2. Copy-paste seluruh file ini > Run
--   3. File ini idempoten (aman di-run ulang): CREATE IF NOT EXISTS,
--      CREATE OR REPLACE, DROP IF EXISTS sebelum CREATE POLICY/TRIGGER.
--
-- PEMETAAN SRS -> SUPABASE:
--   SRS §9.1 "User" (id, name, email/username, password_hash, created_at,
--   updated_at) dipenuhi oleh DUA tabel bawaan + custom:
--     - auth.users (bawaan Supabase Auth): id, email (unique), encrypted_password
--       (bcrypt, memenuhi NFR-01 tanpa kita pegang plaintext), created_at, updated_at.
--     - public.profiles (di bawah): id (FK ke auth.users), name, username (unique).
--   Jadi TIDAK ada tabel custom yang menyimpan password. Register/login/logout/
--   session (SRS Modul A+B, Programmer 1) pakai Supabase Auth via
--   lib/supabase/{client,server}.ts yang sudah ada.
--
--   SRS §9.2 "Transaction" -> public.transactions (di bawah), lengkap dengan
--   user_id (ownership, SRS FR-14), CHECK type income/expense, CHECK amount > 0
--   (SRS P2-03: nominal <= 0 ditolak).
--
--   SRS §4.2 / Modul F (Programmer 3): isolasi data antar user ditegakkan di
--   database via Row Level Security — user hanya bisa baca/tulis baris dengan
--   user_id/id = auth.uid() miliknya sendiri.
-- ============================================================================

-- 0. Ekstensi untuk gen_random_uuid() (di Supabase umumnya sudah aktif).
create extension if not exists "pgcrypto";

-- 0b. Helper: otomatis sentuh updated_at setiap UPDATE.
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- 1. PROFILES — perpanjangan auth.users (SRS §9.1)
-- ============================================================================
create table if not exists public.profiles (
  id         uuid        primary key references auth.users (id) on delete cascade,
  name       text        not null,
  username   text        unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-buat baris profile setiap ada user baru daftar (Supabase Auth trigger).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1), 'User')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================================
-- 2. TRANSACTIONS (SRS §9.2 + struktur data SRS §2.3)
-- ============================================================================
create table if not exists public.transactions (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references auth.users (id) on delete cascade,
  type             text        not null check (type in ('income', 'expense')),
  amount           numeric(12, 2) not null check (amount > 0),
  category         text        not null,
  description      text        not null default '',
  transaction_date date        not null default current_date,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Sorting konsisten default (SRS P2-09, FR-16: terbaru -> terlama) + filter
-- income/expense (SRS P2-10, FR-17) selalu di-scope per user.
create index if not exists idx_transactions_user_date
  on public.transactions (user_id, transaction_date desc);
create index if not exists idx_transactions_user_type
  on public.transactions (user_id, type);

drop trigger if exists trg_transactions_updated_at on public.transactions;
create trigger trg_transactions_updated_at
  before update on public.transactions
  for each row execute function public.handle_updated_at();

alter table public.transactions enable row level security;

grant select, insert, update, delete on public.transactions to authenticated;

-- P2-13 / P3-08..P3-12: tolak operasi terhadap transaksi milik user lain.
drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own"
  on public.transactions for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own"
  on public.transactions for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own"
  on public.transactions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own"
  on public.transactions for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================================
-- 3. VERIFIKASI (jalankan manual setelah migration, expect semua OK)
-- ----------------------------------------------------------------------------
--   select tablename, rowsecurity
--   from pg_tables where schemaname = 'public'
--   and tablename in ('profiles', 'transactions');
--   -- expect: rowsecurity = true untuk keduanya
--
--   select policyname, cmd from pg_policies
--   where schemaname = 'public' and tablename = 'transactions';
--   -- expect: 4 policies (select/insert/update/delete ..._own)
--
--   -- Dashboard summary (SRS P3-02..P3-04, milik user login saja):
--   select
--     coalesce(sum(amount) filter (where type = 'income'), 0)  as total_income,
--     coalesce(sum(amount) filter (where type = 'expense'), 0) as total_expense,
--     coalesce(sum(amount) filter (where type = 'income'), 0)
--     - coalesce(sum(amount) filter (where type = 'expense'), 0) as balance
--   from public.transactions
--   where user_id = auth.uid();
-- ============================================================================
