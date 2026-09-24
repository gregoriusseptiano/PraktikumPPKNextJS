import Link from "next/link";
import { ChartPie, House, Plus, ReceiptText } from "lucide-react";

export type NavTab = "beranda" | "transaksi" | "laporan";

/**
 * Bottom navigation (DESIGN.md §3.10). Slot: Beranda, Transaksi,
 * FAB (+) Tambah, Laporan. Hanya route yang ada yang dirender (R-24):
 * Notifikasi dan Profil dari referensi tidak dirender.
 * Tanpa label teks (ikon saja) sehingga tiap item wajib aria-label.
 *
 * FAB membuka form tambah milik Programmer 2 (Modul C, bottom sheet);
 * href /transactions adalah jahitan integrasi P3-15.
 */
export function BottomNav({ active }: { active: NavTab }) {
  const itemClass = (isActive: boolean) =>
    `flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
      isActive ? "text-primary" : "text-subtle"
    }`;

  return (
    <nav
      aria-label="Navigasi utama"
      className="sticky bottom-0 z-10 flex items-center justify-around bg-surface px-6 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-2px_8px_rgba(0,0,0,0.06)]"
    >
      <Link
        href="/dashboard"
        aria-label="Beranda"
        aria-current={active === "beranda" ? "page" : undefined}
        className={itemClass(active === "beranda")}
      >
        <House
          size={24}
          strokeWidth={1.75}
          fill={active === "beranda" ? "currentColor" : "none"}
        />
      </Link>
      <Link
        href="/transactions"
        aria-label="Transaksi"
        aria-current={active === "transaksi" ? "page" : undefined}
        className={itemClass(active === "transaksi")}
      >
        <ReceiptText
          size={24}
          strokeWidth={1.75}
          fill={active === "transaksi" ? "currentColor" : "none"}
        />
      </Link>
      <Link
        href="/transactions"
        aria-label="Tambah transaksi"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Plus size={24} strokeWidth={2.25} />
      </Link>
      <Link
        href="/reports"
        aria-label="Laporan"
        aria-current={active === "laporan" ? "page" : undefined}
        className={itemClass(active === "laporan")}
      >
        <ChartPie
          size={24}
          strokeWidth={1.75}
          fill={active === "laporan" ? "currentColor" : "none"}
        />
      </Link>
    </nav>
  );
}
