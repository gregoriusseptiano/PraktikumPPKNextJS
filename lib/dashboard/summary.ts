/**
 * DUITku — Modul E + F (Programmer 3: feature/dashboard-security)
 *
 * Fungsi MURNI (tanpa I/O) untuk dashboard. Dipakai oleh DAL
 * (`lib/dashboard/dal.ts`) dan diuji oleh `summary.test.ts`
 * via `node --test` tanpa dependensi tambahan (SRS P3-16).
 *
 * Aturan validasi input (SRS P3-13, NFR-03):
 * - tipe hanya "income" / "expense", selain itu baris diabaikan
 * - nominal harus angka berhingga dan > 0 (SRS P2-03), selain itu diabaikan
 * - user_id tidak pernah diambil dari input client (SRS FR-14)
 */

import type { DashboardSummary } from "./types";

export const INCOME = "income";
export const EXPENSE = "expense";

/** Batas jumlah widget transaksi terbaru (SRS P3-05). */
export const RECENT_MIN = 1;
export const RECENT_MAX = 20;
export const RECENT_DEFAULT = 5;

/** Pola UUID v4 untuk validasi ID sebelum query (SRS P3-13). */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Bentuk baris mentah apa adanya dari database / sumber lain. */
export interface RawTransactionRow {
  type: unknown;
  amount: unknown;
}

/** Baris mentah plus kategori untuk agregasi chart. */
export interface CategoryRow extends RawTransactionRow {
  category?: unknown;
}

/** True bila value adalah tipe transaksi yang sah. */
export function isTransactionType(
  value: unknown,
): value is "income" | "expense" {
  return value === INCOME || value === EXPENSE;
}

/**
 * Normalisasi nominal ke number. Mengembalikan null bila input invalid
 * (bukan angka, NaN, Infinity, atau <= 0) sehingga barisnya bisa
 * dilewati alih-alih merusak ringkasan (SRS P2-03, P3-13).
 * Menerima string numerik karena kolom numeric Postgres bisa
 * tiba sebagai string lewat Supabase.
 */
export function normalizeAmount(value: unknown): number | null {
  const num = typeof value === "string" ? Number(value.trim()) : Number(value);
  if (!Number.isFinite(num) || num <= 0) return null;
  return Math.round(num * 100) / 100;
}

/**
 * Hitung ringkasan dashboard (SRS P3-02..P3-04):
 *   totalIncome  = SUM(amount) untuk type = income
 *   totalExpense = SUM(amount) untuk type = expense
 *   balance      = totalIncome - totalExpense
 * Baris invalid dilewati. Tanpa baris valid -> 0, 0, 0 (SRS P3-06).
 * Pemanggil WAJIB memberi baris yang sudah difilter per user aktif
 * (SRS P3-08, P3-12); fungsi ini tidak tahu soal user.
 */
export function computeSummary(
  rows: readonly RawTransactionRow[],
): DashboardSummary {
  let totalIncome = 0;
  let totalExpense = 0;
  for (const row of rows) {
    if (!isTransactionType(row.type)) continue;
    const amount = normalizeAmount(row.amount);
    if (amount === null) continue;
    if (row.type === INCOME) totalIncome += amount;
    else totalExpense += amount;
  }
  totalIncome = Math.round(totalIncome * 100) / 100;
  totalExpense = Math.round(totalExpense * 100) / 100;
  return {
    totalIncome,
    totalExpense,
    balance: Math.round((totalIncome - totalExpense) * 100) / 100,
  };
}

/**
 * Normalisasi batas jumlah transaksi terbaru. Nilai di luar 1..20
 * dijepit, nilai bukan angka kembali ke default 5 (SRS P3-13).
 */
export function clampRecentLimit(value: unknown): number {
  const num = typeof value === "string" ? Number(value.trim()) : Number(value);
  if (!Number.isFinite(num)) return RECENT_DEFAULT;
  const floored = Math.floor(num);
  if (floored < RECENT_MIN) return RECENT_MIN;
  if (floored > RECENT_MAX) return RECENT_MAX;
  return floored;
}

/**
 * Predikat kepemilikan untuk otorisasi baca/ubah/hapus (SRS P3-09..P3-11).
 * Perbandingan strict string; userId kosong tidak pernah cocok.
 */
export function isOwnedBy(rowUserId: unknown, userId: string): boolean {
  if (typeof rowUserId !== "string" || rowUserId.length === 0) return false;
  if (typeof userId !== "string" || userId.length === 0) return false;
  return rowUserId === userId;
}

/** True bila value berbentuk UUID (validasi ID sebelum query, SRS P3-13). */
export function isUuid(value: unknown): boolean {
  return typeof value === "string" && UUID_RE.test(value);
}

/**
 * Urutan warna chart kategori (encoding data, DESIGN.md §2.1).
 * Kategori diurut nominal menurun, warna diberikan sesuai urutan itu
 * dan dipertahankan di semua layar (jangan diacak).
 */
export const CATEGORY_COLOR_TOKENS = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "chart-6",
] as const;

export interface CategoryTotal {
  category: string;
  total: number;
  /** Pangsa 0..1 terhadap total (untuk busur chart). */
  share: number;
  /** Token warna sesuai urutan nominal. */
  colorToken: (typeof CATEGORY_COLOR_TOKENS)[number];
}

/**
 * Agregasi per kategori untuk pie chart dan donut anggaran
 * (DESIGN.md §3.3, §3.9, §4.4). Input seharusnya sudah difilter per
 * user aktif dan per tipe/bulan oleh DAL; baris invalid dilewati.
 */
export function aggregateByCategory(
  rows: readonly CategoryRow[],
): CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const row of rows) {
    const amount = normalizeAmount(row.amount);
    if (amount === null) continue;
    const category =
      typeof row.category === "string" && row.category.trim().length > 0
        ? row.category.trim()
        : "Lain-lain";
    totals.set(category, (totals.get(category) ?? 0) + amount);
  }
  const grand = [...totals.values()].reduce((a, b) => a + b, 0);
  if (grand <= 0) return [];
  return [...totals.entries()]
    .map(([category, total], index) => ({
      category,
      total: Math.round(total * 100) / 100,
      share: total / grand,
      colorToken:
        CATEGORY_COLOR_TOKENS[index % CATEGORY_COLOR_TOKENS.length],
    }))
    .sort((a, b) => b.total - a.total)
    .map((item, index) => ({
      ...item,
      colorToken:
        CATEGORY_COLOR_TOKENS[index % CATEGORY_COLOR_TOKENS.length],
    }));
}

export interface PieSlice extends CategoryTotal {
  /** Sudut awal irisan, derajat, searah jarum jam dari atas. */
  startAngle: number;
  /** Sudut akhir irisan, derajat. */
  endAngle: number;
}

/** Ubah agregasi kategori menjadi irisan pie (jumlah sudut 360). */
export function buildPieSlices(items: readonly CategoryTotal[]): PieSlice[] {
  let angle = 0;
  return items.map((item) => {
    const startAngle = angle;
    angle += item.share * 360;
    return { ...item, startAngle, endAngle: angle };
  });
}
