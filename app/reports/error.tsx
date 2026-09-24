"use client";

/**
 * Error boundary laporan (DESIGN.md §7; SRS P3-14, NFR-04).
 * Objek error TIDAK dirender agar tidak ada kebocoran detail internal.
 */
export default function ReportsError({ retry }: { retry: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-background">
      <div className="bg-header px-5 pt-6 pb-12">
        <p className="text-lg font-bold text-on-header">Laporan Keuangan</p>
      </div>
      <div className="mx-[18px] -mt-6 flex-1 rounded-md bg-surface p-5">
        <div
          role="alert"
          className="rounded-md border border-expense/30 bg-expense/10 px-4 py-3"
        >
          <p className="text-sm font-semibold text-ink">
            Gagal memuat laporan.
          </p>
          <p className="mt-1 text-sm text-subtle">
            Periksa koneksimu lalu coba lagi.
          </p>
        </div>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-4 inline-flex min-h-11 items-center rounded-md bg-header px-5 text-sm font-semibold text-on-header focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}
