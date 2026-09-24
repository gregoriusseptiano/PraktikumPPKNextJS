export default function TransactionsLoading() {
  return (
    <div
      aria-label="Memuat riwayat transaksi"
      aria-busy="true"
      className="min-h-screen bg-background animate-pulse"
    >
      {/* Top Navbar Skeleton */}
      <div className="border-b border-divider bg-surface px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-ink/10" />
            <div className="h-6 w-28 rounded bg-ink/10" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-32 rounded-lg bg-ink/10" />
            <div className="h-8 w-8 rounded-full bg-ink/10" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Back button skeleton */}
        <div className="h-5 w-40 rounded bg-ink/10" />

        {/* Page Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-divider pb-6">
          <div className="space-y-2">
            <div className="h-8 w-60 rounded bg-ink/10" />
            <div className="h-4 w-72 rounded bg-ink/10" />
          </div>
          <div className="h-11 w-36 rounded-lg bg-ink/10" />
        </div>

        {/* Filter Chips Skeleton */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 w-24 rounded-lg bg-ink/10" />
          ))}
        </div>

        {/* Transaction List Card Skeleton */}
        <div className="rounded-xl border border-divider bg-surface divide-y divide-divider shadow-sm">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5">
              <div className="flex items-start gap-3.5 flex-1">
                <div className="h-10 w-10 rounded-lg bg-ink/10 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-36 rounded bg-ink/10" />
                  <div className="h-3 w-52 rounded bg-ink/10" />
                  <div className="h-3 w-24 rounded bg-ink/10" />
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <div className="h-5 w-28 rounded bg-ink/10" />
                <div className="h-4 w-20 rounded bg-ink/10" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
