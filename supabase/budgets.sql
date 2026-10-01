-- ============================================================================
-- DUITku — Budget Bulanan (Pertemuan 5, SRS FR-23..FR-28)
-- Sumber: SRS.md §13.2 (Fitur Baru: Budget Bulanan)
--
-- CARA PAKAI:
--   1. Buka Supabase Dashboard > SQL Editor > New query
--   2. Copy-paste seluruh file ini > Run
--   3. File ini idempoten (aman di-run ulang): CREATE IF NOT EXISTS,
--      CREATE OR REPLACE, DROP IF EXISTS sebelum CREATE POLICY/TRIGGER.
--
-- PEMETAAN SRS -> SUPABASE:
--   FR-23: Create/Update Budget -> INSERT/UPDATE budgets
--   FR-24: Read Budget + progress -> SELECT budgets + SUM expense
--   FR-25: Delete Budget -> DELETE budgets
--   FR-26: Budget Ownership -> user_id dari session, UNIQUE(user_id,month)
--   FR-27: Budget AJAX -> semua via API fetch (P2/P3 task)
--   FR-28: Budget Isolation -> RLS + DAL filter user_id
-- ============================================================================

-- 1. TABEL BUDGETS
-- ----------------------------------------------------------------------------
-- Satu user hanya boleh punya 1 budget per bulan (UNIQUE user_id, month).
-- Month format: YYYY-MM (dipaksa via CHECK constraint).
-- Amount > 0 (dipaksa via CHECK constraint).
-- ----------------------------------------------------------------------------
create table if not exists public.budgets (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users (id) on delete cascade,
  month       text        not null check (month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  amount      numeric(12, 2) not null check (amount > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, month)
);

-- Index untuk query cepat per user + bulan
create index if not exists idx_budgets_user_month
  on public.budgets (user_id, month desc);

-- Trigger otomatis update updated_at
drop trigger if exists trg_budgets_updated_at on public.budgets;
create trigger trg_budgets_updated_at
  before update on public.budgets
  for each row execute function public.handle_updated_at();

-- ============================================================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- User hanya bisa baca/tulis budget miliknya sendiri (FR-28, NFR-02).
-- ============================================================================

alter table public.budgets enable row level security;

grant select, insert, update, delete on public.budgets to authenticated;

drop policy if exists "budgets_select_own" on public.budgets;
create policy "budgets_select_own"
  on public.budgets for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "budgets_insert_own" on public.budgets;
create policy "budgets_insert_own"
  on public.budgets for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "budgets_update_own" on public.budgets;
create policy "budgets_update_own"
  on public.budgets for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "budgets_delete_own" on public.budgets;
create policy "budgets_delete_own"
  on public.budgets for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================================
-- 3. VERIFIKASI (jalankan manual setelah migration, expect semua OK)
-- ----------------------------------------------------------------------------
--   select tablename, rowsecurity
--   from pg_tables where schemaname = 'public'
--   and tablename = 'budgets';
--   -- expect: rowsecurity = true
--
--   select policyname, cmd from pg_policies
--   where schemaname = 'public' and tablename = 'budgets';
--   -- expect: 4 policies (select/insert/update/delete ..._own)
-- ============================================================================
