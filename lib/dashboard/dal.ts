/**
 * DUITku — Modul E + F (Programmer 3: feature/dashboard-security)
 *
 * Data Access Layer dashboard. Satu-satunya jalan membaca data
 * dashboard: selalu verifikasi session (integrasi dengan session
 * milik Programmer 1, SRS P1-09) lalu query HANYA baris dengan
 * user_id milik user aktif (SRS P3-08, P3-12, NFR-02).
 *
 * Keamanan (SRS P3-13, P3-14, NFR-03, NFR-04):
 * - user_id diambil dari session server, tidak pernah dari input client
 *   (SRS FR-14).
 * - ID transaksi divalidasi format UUID sebelum query.
 * - Baris DB dinormalisasi defensif; baris invalid dilewati.
 * - Error DB dicatat di log server saja; ke pemanggil hanya
 *   dilempar pesan generik (tanpa query, secret, atau stack trace).
 * - Fungsi tidak ditemukan vs bukan milik dibedakan TIDAK: keduanya
 *   menghasilkan null/false agar tidak menjadi oracle kepemilikan.
 */

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { DashboardData, RecentTransaction, ReportsData } from "./types";
import {
  aggregateByCategory,
  clampRecentLimit,
  computeSummary,
  isOwnedBy,
  isTransactionType,
  isUuid,
  normalizeAmount,
} from "./summary";
import { currentMonthKey, isValidMonth, monthRange } from "./format";

/** Pesan generik untuk semua kegagalan data (SRS P3-14, NFR-04). */
export const DASHBOARD_ERROR_MESSAGE =
  "Gagal memuat data dashboard. Coba lagi.";

/**
 * Ambil ID user dari session aktif. Redirect ke /login bila tidak ada
 * session valid (protected access, SRS P1-09; integrasi Auth, P3-15).
 * Hasil di-cache per request agar dipakai berulang tanpa query ulang.
 */
export const requireUserId = cache(async (): Promise<string> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/login");
  }
  return data.user.id;
});

/** Bentuk kolom yang dibaca dari public.transactions (SRS §9.2). */
interface TransactionColumns {
  id: unknown;
  user_id: unknown;
  type: unknown;
  amount: unknown;
  category: unknown;
  description: unknown;
  transaction_date: unknown;
}

function toTransactionColumns(value: unknown): TransactionColumns | null {
  if (typeof value !== "object" || value === null) return null;
  const row = value as Record<string, unknown>;
  return {
    id: row.id,
    user_id: row.user_id,
    type: row.type,
    amount: row.amount,
    category: row.category,
    description: row.description,
    transaction_date: row.transaction_date,
  };
}

function toRecentTransaction(
  row: TransactionColumns,
  userId: string,
): RecentTransaction | null {
  // Pertahanan berlapis: RLS sudah memfilter di DB, di sini diverifikasi
  // lagi agar bug query tidak pernah membocorkan data user lain (P3-09).
  if (!isOwnedBy(row.user_id, userId)) return null;
  if (!isTransactionType(row.type)) return null;
  const amount = normalizeAmount(row.amount);
  if (amount === null) return null;
  if (typeof row.id !== "string" || row.id.length === 0) return null;
  return {
    id: row.id,
    type: row.type,
    amount,
    category: typeof row.category === "string" ? row.category : "",
    description: typeof row.description === "string" ? row.description : "",
    transactionDate:
      typeof row.transaction_date === "string" ? row.transaction_date : "",
  };
}

/**
 * Ringkasan + transaksi terbaru milik user aktif (SRS P3-02..P3-05).
 * Selalu segar dari database sehingga berubah mengikuti CRUD
 * transaksi (SRS P3-07): halaman Server Component memanggil ini
 * tiap request, dan aksi mutasi cukup revalidatePath("/dashboard").
 */
export async function getDashboardData(
  recentLimit: unknown = 5,
): Promise<DashboardData> {
  const userId = await requireUserId();
  const limit = clampRecentLimit(recentLimit);
  try {
    const supabase = await createClient();
    const [summaryRes, recentRes] = await Promise.all([
      supabase
        .from("transactions")
        .select("type, amount")
        .eq("user_id", userId),
      supabase
        .from("transactions")
        .select(
          "id, user_id, type, amount, category, description, transaction_date",
        )
        .eq("user_id", userId)
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit),
    ]);

    if (summaryRes.error) throw summaryRes.error;
    if (recentRes.error) throw recentRes.error;

    const summaryRows = Array.isArray(summaryRes.data)
      ? summaryRes.data
      : [];
    const summary = computeSummary(
      summaryRows
        .map(toTransactionColumns)
        .filter((row): row is TransactionColumns => row !== null),
    );

    const recentRows = Array.isArray(recentRes.data) ? recentRes.data : [];
    const recent: RecentTransaction[] = [];
    for (const raw of recentRows) {
      const row = toTransactionColumns(raw);
      if (row === null) continue;
      const item = toRecentTransaction(row, userId);
      if (item !== null) recent.push(item);
    }

    const displayName = await getDisplayName(userId);

    return { summary, recent, displayName };
  } catch (err) {
    // Hanya log server; client menerima pesan generik (SRS P3-14).
    console.error("[dashboard] getDashboardData failed:", err);
    throw new Error(DASHBOARD_ERROR_MESSAGE);
  }
}

/**
 * Nama sapaan dari profil milik user (avatar inisial, DESIGN.md §3.11).
 * Best-effort: null bila belum ada sehingga UI memakai "Kamu".
 * RLS profiles_select_own sudah membatasi ke baris milik sendiri.
 */
async function getDisplayName(userId: string): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", userId)
      .maybeSingle();
    if (error || !data) return null;
    const name =
      typeof (data as { name?: unknown }).name === "string"
        ? (data as { name: string }).name.trim()
        : "";
    return name.length > 0 ? name : null;
  } catch (err) {
    console.error("[dashboard] getDisplayName failed:", err);
    return null;
  }
}

/**
 * Data laporan satu bulan per tipe (DESIGN.md §4.4).
 * Bulan invalid kembali ke bulan berjalan, tipe invalid ke "expense"
 * (SRS P3-13). Semua baris milik user aktif (SRS P3-12).
 */
export async function getReportsData(
  rawType: unknown = "expense",
  rawMonth: unknown = currentMonthKey(),
): Promise<ReportsData> {
  const type = isTransactionType(rawType) ? rawType : "expense";
  const month =
    isValidMonth(rawMonth) && typeof rawMonth === "string"
      ? rawMonth
      : currentMonthKey();
  const { start, end } = monthRange(month);
  const userId = await requireUserId();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("transactions")
      .select(
        "id, user_id, type, amount, category, description, transaction_date",
      )
      .eq("user_id", userId)
      .eq("type", type)
      .gte("transaction_date", start)
      .lte("transaction_date", end)
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = (Array.isArray(data) ? data : [])
      .map(toTransactionColumns)
      .filter((row): row is TransactionColumns => row !== null);
    const items: RecentTransaction[] = [];
    for (const row of rows) {
      const item = toRecentTransaction(row, userId);
      if (item !== null) items.push(item);
    }
    const summary = computeSummary(rows);
    const total = type === "income" ? summary.totalIncome : summary.totalExpense;
    return {
      month,
      type,
      total,
      count: items.length,
      byCategory: aggregateByCategory(rows),
      items,
    };
  } catch (err) {
    console.error("[dashboard] getReportsData failed:", err);
    throw new Error(DASHBOARD_ERROR_MESSAGE);
  }
}

/**
 * Otorisasi baca satu transaksi (SRS P3-09): mengembalikan transaksi
 * hanya bila ID valid DAN milik user aktif. ID asing, ID user lain,
 * atau ID invalid semuanya menghasilkan null.
 */
export async function getOwnedTransaction(
  transactionId: unknown,
): Promise<RecentTransaction | null> {
  if (!isUuid(transactionId)) return null;
  const userId = await requireUserId();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("transactions")
      .select(
        "id, user_id, type, amount, category, description, transaction_date",
      )
      .eq("id", transactionId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) return null;
    const row = toTransactionColumns(data);
    if (row === null) return null;
    return toRecentTransaction(row, userId);
  } catch (err) {
    console.error("[dashboard] getOwnedTransaction failed:", err);
    return null;
  }
}

/**
 * Otorisasi ubah/hapus (SRS P3-10, P3-11) untuk dipakai aksi mutasi:
 * true hanya bila ID valid DAN baris milik user aktif. Dipakai sebelum
 * update/delete agar request langsung ke data user lain ditolak di
 * lapisan aplikasi, melengkapi RLS di database.
 */
export async function assertTransactionOwnership(
  transactionId: unknown,
): Promise<boolean> {
  if (!isUuid(transactionId)) return false;
  const userId = await requireUserId();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("transactions")
      .select("user_id")
      .eq("id", transactionId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) return false;
    const row = toTransactionColumns(data);
    return row !== null && isOwnedBy(row.user_id, userId);
  } catch (err) {
    console.error("[dashboard] assertTransactionOwnership failed:", err);
    return false;
  }
}
