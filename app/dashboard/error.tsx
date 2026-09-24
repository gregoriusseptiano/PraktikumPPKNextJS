"use client";

/**
 * Error boundary dashboard (DESIGN.md §7: state error; SRS P3-14, NFR-04).
 * Pesan generik + tombol "Coba lagi" memakai prop `retry` (stabil di
 * Next 16.3). Objek error TIDAK dirender agar stack trace, query,
 * atau secret tidak bocor ke pengguna.
 */
export default function DashboardError({ retry }: { retry: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 bg-paper px-5 py-8 text-ink">
      <p className="text-sm font-semibold tracking-tight text-ink/60">
        DUITku
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div
        role="alert"
        className="rounded-[10px] border border-expense/30 bg-expense/10 px-5 py-4"
      >
        <p className="text-[15px] font-medium">
          Gagal memuat data dashboard.
        </p>
        <p className="mt-1 text-[15px] text-ink/70">
          Periksa koneksimu lalu coba lagi.
        </p>
      </div>
      <button
        type="button"
        onClick={() => retry()}
        className="inline-flex min-h-11 w-fit items-center rounded-lg bg-duit px-5 text-[15px] font-semibold text-on-duit transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-duit"
      >
        Coba lagi
      </button>
    </main>
  );
}
