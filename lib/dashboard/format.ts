/**
 * DUITku — format tampilan (DESIGN.md §2.2, Programmer 3).
 * Fungsi murni, diuji via node --test (SRS P3-16).
 *
 * Aturan angka: titik pemisah ribuan, prefiks "Rp " plus spasi untuk
 * nominal besar; di daftar transaksi: tanda plus spasi plus angka
 * ("- 100.000", "+ 75.000") tanpa "Rp".
 */

/** Format Rupiah. sign "auto" hanya menampilkan "-" bila negatif. */
export function rupiah(
  n: number,
  options: { prefix?: boolean; sign?: boolean | "auto" } = {},
): string {
  const { prefix = true, sign = false } = options;
  const abs = Math.abs(n).toLocaleString("id-ID");
  let s = "";
  if (sign === true) s = n < 0 ? "- " : "+ ";
  else if (sign === "auto" && n < 0) s = "- ";
  return `${s}${prefix ? "Rp " : ""}${abs}`;
}

/** "2020-01-12" -> "12 Januari 2020" (caption minimal 11px di UI). */
export function formatTanggal(isoDate: string): string {
  if (!isoDate) return "-";
  const parsed = new Date(isoDate + (isoDate.length === 10 ? "T00:00:00" : ""));
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

/** "2020-01" -> "Januari 2020" untuk label date picker. */
export function formatBulan(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  if (!y || !m || m < 1 || m > 12) return monthKey;
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, 1));
}

/** Kunci bulan "YYYY-MM" dari tanggal sekarang (default laporan). */
export function currentMonthKey(now: Date = new Date()): string {
  const m = now.getMonth() + 1;
  return `${now.getFullYear()}-${m < 10 ? `0${m}` : m}`;
}

/** True bila value berbentuk kunci bulan "YYYY-MM" (SRS P3-13). */
export function isValidMonth(value: unknown): value is string {
  return (
    typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value)
  );
}

/**
 * Rentang [awal, akhir] inklusif untuk query satu bulan.
 * Mengembalikan string "YYYY-MM-DD" agar perbandingan tanggal
 * konsisten tanpa urusan zona waktu.
 */
export function monthRange(monthKey: string): { start: string; end: string } {
  const [y, m] = monthKey.split("-").map(Number);
  const lastDay = new Date(y, m, 0).getDate();
  const pad = (d: number) => (d < 10 ? `0${d}` : `${d}`);
  return {
    start: `${y}-${pad(m)}-01`,
    end: `${y}-${pad(m)}-${lastDay}`,
  };
}

/** Geser kunci bulan sejauh delta (untuk navigasi bulan). */
export function shiftMonth(monthKey: string, delta: number): string {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return currentMonthKey(d);
}
