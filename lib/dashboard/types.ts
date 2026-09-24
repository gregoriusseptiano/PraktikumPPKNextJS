/**
 * DUITku — Modul E + F (Programmer 3: feature/dashboard-security)
 *
 * DTO (Data Transfer Object) dashboard. Hanya field aman yang boleh
 * diteruskan ke Client Component / response JSON (SRS NFR-04, P3-14):
 * tanpa password hash, secret, query, atau stack trace.
 */

/** Ringkasan keuangan milik satu user (SRS P3-02..P3-04). */
export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

/** Satu baris transaksi terbaru untuk widget dashboard (SRS P3-05). */
export interface RecentTransaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  transactionDate: string;
}

/** Payload gabungan untuk halaman + route handler dashboard. */
export interface DashboardData {
  summary: DashboardSummary;
  recent: RecentTransaction[];
  /** Nama sapaan dari profil (null bila belum diisi, tampil "Kamu"). */
  displayName: string | null;
}

/** Agregasi satu bulan untuk layar laporan (DESIGN.md §4.4). */
export interface ReportsData {
  month: string;
  type: "income" | "expense";
  total: number;
  count: number;
  byCategory: import("./summary").CategoryTotal[];
  items: RecentTransaction[];
}
